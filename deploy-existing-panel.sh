#!/usr/bin/env bash
set -Eeuo pipefail

panel_dir=${1:-/var/www/pterodactyl}
archive=${2:?Usage: deploy-existing-panel.sh PANEL_DIRECTORY RELEASE_ARCHIVE}
maintenance_enabled=0
backup_dir=''

on_error() {
    local status=$?
    trap - ERR
    if [[ "$maintenance_enabled" -eq 1 ]]; then
        echo "Deployment failed. The panel is left in maintenance mode; backups are at: $backup_dir" >&2
    else
        echo "Deployment stopped before maintenance mode. No live files were replaced." >&2
    fi
    exit "$status"
}
trap on_error ERR

if [[ "$EUID" -ne 0 ]]; then
    echo "Run this script with sudo." >&2
    exit 1
fi

if [[ ! -f "$panel_dir/artisan" || ! -f "$panel_dir/.env" ]]; then
    echo "No existing Laravel panel and .env found at: $panel_dir" >&2
    exit 1
fi

if [[ ! -f "$archive" ]]; then
    echo "Release archive not found: $archive" >&2
    exit 1
fi

read_env_value() {
    local value
    value=$(sed -n "s/^$1=//p" "$panel_dir/.env" | tail -n 1)
    value=${value%$'\r'}
    value=${value#\"}
    value=${value%\"}
    value=${value#\'}
    value=${value%\'}
    printf '%s' "$value"
}

app_environment=$(read_env_value APP_ENV)
app_debug=$(read_env_value APP_DEBUG)
app_url=$(read_env_value APP_URL)
database_driver=$(read_env_value DB_CONNECTION)
database_name=$(read_env_value DB_DATABASE)
app_host=${app_url#*://}
app_host=${app_host%%/*}
app_host=${app_host%%:*}

if [[ "$app_environment" != 'production' || "$app_debug" != 'false' ]]; then
    echo "Refusing deployment: existing .env must have APP_ENV=production and APP_DEBUG=false." >&2
    exit 1
fi

if [[ "$database_driver" != 'mysql' && "$database_driver" != 'mariadb' ]] || [[ ! "$database_name" =~ ^[A-Za-z0-9_]+$ ]]; then
    echo "Refusing deployment: could not safely identify a MySQL/MariaDB database in .env." >&2
    exit 1
fi

if ! tar -tzf "$archive" | grep -x './public/assets/manifest.json' >/dev/null || \
    ! tar -xOzf "$archive" ./config/app.php | grep -F "'version' => '1.15.1'," >/dev/null || \
    ! tar -tzf "$archive" | grep -x './deploy-existing-panel.sh' >/dev/null; then
    echo "This archive is missing production assets or is not a Ponkodactyl 1.15.1 build." >&2
    exit 1
fi

if ! command -v mysqldump >/dev/null || ! command -v mysql >/dev/null; then
    echo "Install the MySQL client tools before deploying (mysqldump and mysql are required)." >&2
    exit 1
fi

mysql --user=root --batch --skip-column-names \
    --execute="SELECT 1 FROM \`$database_name\`.migrations LIMIT 1" >/dev/null

echo "Target panel: $panel_dir"
echo "Target URL:   $app_url"
echo "Database:     $database_name"
read -r -p "Type '$app_host' to back up and update this panel: " confirmation
if [[ "$confirmation" != "$app_host" ]]; then
    echo "Confirmation did not match; no changes made." >&2
    exit 1
fi

timestamp=$(date +%Y%m%d-%H%M%S)
backup_dir="/var/backups/ponkodactyl-$timestamp"
install -d -m 700 "$backup_dir"

echo "Backing up panel files to $backup_dir/panel-files.tar.gz..."
tar -czf "$backup_dir/panel-files.tar.gz" -C "$(dirname "$panel_dir")" "$(basename "$panel_dir")"

echo "Backing up database '$database_name'..."
mysqldump --single-transaction --routines --triggers --hex-blob --user=root "$database_name" \
    | gzip -c > "$backup_dir/database.sql.gz"
test -s "$backup_dir/database.sql.gz"

echo "Enabling maintenance mode and updating the panel..."
cd "$panel_dir"
php artisan down --retry=60
maintenance_enabled=1
tar --no-same-owner --no-same-permissions -xzf "$archive" -C "$panel_dir"

if grep -q '^APP_NAME=' .env; then
    sed -i 's/^APP_NAME=.*/APP_NAME=Ponkodactyl/' .env
else
    printf '\nAPP_NAME=Ponkodactyl\n' >> .env
fi

php artisan optimize:clear
php artisan migrate --force
php artisan queue:restart

fpm_service=$(systemctl list-unit-files --type=service --no-legend 'php*-fpm.service' | awk 'NR == 1 { print $1 }')
if [[ -n "$fpm_service" ]]; then
    systemctl reload "$fpm_service"
fi

php artisan up
maintenance_enabled=0
echo "Ponkodactyl 1.15.1 is live at $app_url"
echo "Backups are at $backup_dir"