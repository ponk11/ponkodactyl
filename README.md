# Ponkodactyl

Ponkodactyl is a Pterodactyl Panel fork for operating game-server infrastructure. It adds a custom control-room interface and dashboard tools while retaining the panel's core server-management model.

The Panel stores configuration and coordinates users, servers, and nodes. Wings runs on each node and performs the actual container and game-server work. Ponkodactyl does not replace Wings; a server cannot run until its node is reachable and correctly configured.

This fork is based on upstream Pterodactyl `v1.15.1`.

## Requirements

- PHP 8.2 or 8.3 with the extensions required by Pterodactyl, including `pdo_mysql`
- MySQL or MariaDB for panel data
- Redis for the configured cache, queue, and session services
- A supported web server with HTTPS configured for the panel hostname
- A queue worker and scheduled-task configuration appropriate for the panel installation
- Wings installed on each node that will host game servers

For a production panel, use `APP_ENV=production` and `APP_DEBUG=false`. Keep the database, Redis, and Wings management interfaces private to the services and administrators that require them.

## Installation

Ponkodactyl is a Laravel application and can be installed with Docker (recommended for most operators) or deployed manually on a VPS. Either way, a panel installation is separate from Wings; you'll need at least one reachable node running Wings before you can create servers (see [Initial Panel Checklist](#initial-panel-checklist)).

### Docker Installation (Recommended)

1. Copy [`docker-compose.example.yml`](docker-compose.example.yml) to `docker-compose.yml` and update the placeholder values, at minimum:
   - `MYSQL_PASSWORD` / `MYSQL_ROOT_PASSWORD` under `x-common.database`
   - `APP_URL`, `APP_TIMEZONE`, and `APP_SERVICE_AUTHOR` under `x-common.panel`
   - The `mail` block if you want outgoing panel email to work
2. Create the host directories referenced by the `panel` service volumes (by default under `/srv/pterodactyl/`):
   ```bash
   mkdir -p /srv/pterodactyl/{var,nginx,certs,logs}
   ```
3. Start the stack:
   ```bash
   docker compose up -d
   ```
4. Run the first-time setup inside the `panel` container to generate the application key, migrate/seed the database, and create an administrator account:
   ```bash
   docker compose exec panel php artisan p:environment:setup
   docker compose exec panel php artisan p:environment:database
   docker compose exec panel php artisan migrate --seed --force
   docker compose exec panel php artisan p:user:make
   ```
5. Visit `APP_URL` in a browser and log in with the administrator account you just created.

The official image builds from this repository's [`Dockerfile`](Dockerfile), which compiles frontend assets and the PHP application into a single production-ready container exposing ports 80/443.

### Manual Installation

If you'd rather run the panel directly on a host (without Docker), you'll need:

1. The [Requirements](#requirements) above (PHP 8.2/8.3 with extensions, MySQL/MariaDB, Redis, a web server).
2. The release archive (e.g. `ponkodactyl-v1.15.1.tar.gz`) extracted to your install path (for example `/var/www/pterodactyl`), or a clone of this repository if you intend to build assets yourself (see [BUILDING.md](BUILDING.md)).
3. PHP dependencies installed with Composer:
   ```bash
   composer install --no-dev --optimize-autoloader
   ```
4. An `.env` file copied from [`.env.example`](.env.example) with your database, Redis, mail, and `APP_URL` values filled in.
5. The application configured and database prepared:
   ```bash
   php artisan key:generate --force
   php artisan migrate --seed --force
   php artisan p:user:make
   ```
6. `storage/` and `bootstrap/cache/` writable by your web server user, and a web server (nginx/Apache + PHP-FPM) configured to serve `public/` over HTTPS.
7. A queue worker and scheduler running continuously, since the panel relies on both for emails, server installs, and scheduled tasks:
   ```bash
   # Run under a process manager (systemd, supervisor, etc.) so it restarts if it dies.
   php artisan queue:work --queue=high,standard,low --sleep=3 --tries=3
   ```
   ```cron
   # Crontab entry for the scheduler
   * * * * * php /var/www/pterodactyl/artisan schedule:run >> /dev/null 2>&1
   ```

Once the panel is reachable, follow the [Initial Panel Checklist](#initial-panel-checklist) to configure Locations, Nodes, and Wings before creating servers for clients.

## Panel Features

### Client Area

Clients see the servers assigned to their account. Opening a server provides the server dashboard and the tools permitted by that user's server permissions:

- Console, live resource utilization, and start/stop/restart controls
- File browsing, editing, upload/download, rename, copy, archive, and permission operations
- Database management, recurring schedules, and server activity history
- Subuser access and per-server permissions
- Backup creation, locking, restore, download, and deletion
- Network allocations, startup variables, and server settings

Account pages provide profile and security settings, API credentials, SSH keys, and account activity. Available server actions depend on the permissions granted to the user.

### Administrator Area

Panel administrators have access to the administration area in addition to client features. The current admin navigation includes:

- **Overview:** panel totals and shortcuts for common setup tasks
- **Settings:** general panel settings, mail configuration, and advanced settings
- **API:** application API credential management
- **Database Hosts:** database hosts available when provisioning servers
- **Locations and Nodes:** infrastructure organization, Wings configuration, allocations, and node maintenance
- **Servers:** provisioning, details, resource limits, startup configuration, databases, mounts, suspension, reinstall, transfer, and deletion
- **Users:** account creation and management
- **Mounts:** shared mount definitions and assignments
- **Nests and Eggs:** game-server definitions, variables, scripts, and import/export

Some server and node operations are destructive. Review the selected resource and confirm backups before deleting, reinstalling, transferring, or changing production configuration.

## Initial Panel Checklist

For a newly installed panel, complete the following before offering server creation to clients:

1. Confirm the panel hostname uses HTTPS and production settings are enabled.
2. Configure panel mail if users need invitations, notifications, or password recovery.
3. Create a Location for each infrastructure region or group you operate.
4. Create a Node for each Wings host. Set its hostname, daemon connection details, resource limits, and TLS settings to match the Wings configuration.
5. Install and configure Wings on that host, then verify that the node is communicating with the Panel.
6. Add available IP and port allocations to the Node.
7. Confirm the required Nests and Eggs are available and review their startup variables and install settings.
8. Create a test server using a non-production allocation and verify installation, console access, file access, and power controls.
9. Create client accounts and assign only the servers and permissions each user needs.
10. Establish automated database and file backups and periodically verify that a restore works.

Do not connect a test Panel to a production Wings node. Separate Panels sharing a Wings node can conflict over server management.

## Upgrade an Existing Panel

Use a published Ponkodactyl release archive and the included guarded deployment scripts. The update is operator-initiated; it does not run on every save or automatically publish source changes.

### Before the Update

The updater refuses to proceed unless the existing panel has `APP_ENV=production`, `APP_DEBUG=false`, a MySQL/MariaDB database, and a recognizable database name. It also validates the release archive contents and expected Ponkodactyl version. The VPS needs `mysql` and `mysqldump` client commands, and the updater must be able to connect to MySQL as root.

Schedule maintenance, notify users, confirm the hostname and panel path, and ensure the VPS has enough free disk space for a full panel archive and database dump. The deployment script creates additional backups, but these do not replace your normal off-host backup policy.

### Windows Operator

Place the release archive beside `deploy-ponkodactyl.ps1`. From Windows PowerShell, run the helper with the SSH destination and, if needed, the panel path:

```powershell
powershell.exe -ExecutionPolicy Bypass -File "$HOME\Downloads\deploy-ponkodactyl.ps1" -Target ubuntu@panel.example.com -PanelPath /var/www/pterodactyl
```

The helper uploads the archive, verifies its SHA-256 checksum against the local copy, and starts the guarded updater over SSH. It prompts for the panel hostname before making changes. SSH and sudo access must be configured for the target account.

### Linux Operator

From the extracted release directory on the VPS, run the updater with the existing panel directory and uploaded release archive:

```bash
sudo ./deploy-existing-panel.sh /var/www/pterodactyl /tmp/ponkodactyl-v1.15.1.tar.gz
```

Type the hostname from the existing panel's `APP_URL` when prompted. A mismatch stops the update before files or database are replaced.

### What the Updater Does

The guarded updater creates a timestamped backup directory under `/var/backups/ponkodactyl-*`, archives the panel files, and dumps the MySQL/MariaDB database. It then enables maintenance mode, overlays the release, clears Laravel caches, runs migrations, restarts queue workers, reloads PHP-FPM when detected, and returns the panel to service.

It preserves the existing `.env`, `APP_KEY`, storage, uploads, database, web server, Redis, and Wings configuration. If a step fails before maintenance mode, live files have not been replaced. If a step fails after maintenance begins, the panel is left in maintenance mode and the script prints the backup location. Review the error and restore from those backups deliberately; the updater does not automatically roll back a partially applied release.

Do not use the production updater for a test installation. Never run `git pull`, `migrate:fresh`, or `db:seed` against a live panel.

## Backups and Recovery

- Keep regular, encrypted, off-host backups of the panel database and persistent files.
- Include `.env`, `APP_KEY`, uploaded content, and other persistent storage in the recovery plan; without the existing application key, encrypted or signed application data may not work as expected.
- Restrict access to `/var/backups/ponkodactyl-*`; the updater creates these directories with owner-only permissions, but administrators remain responsible for copying backups off the VPS.
- Before a major change, verify that the latest backup is complete and that your restore procedure is understood.
- If deployment fails after maintenance mode is enabled, use the printed backup location and server logs to guide recovery. Do not run migrations or reseed repeatedly while diagnosing a production failure.

## Troubleshooting

### Node Is Unavailable

Check that Wings is running on the configured host, that the Node's hostname and daemon port are reachable from the Panel, and that the configured TLS/certificate settings match the Wings service. Check the Wings and Panel logs for connection or authentication errors. Confirm firewall rules permit only the required Panel-to-Wings traffic.

### Server Does Not Appear for a Client

Confirm the server is assigned to the expected user and that the user has an active account. For shared access, review the server's Users permissions; access to one server does not grant access to other servers.

### Server Installation Fails

Review the server's install status and logs, then verify that the selected Egg, startup variables, Node, and allocation are valid. Confirm Wings can access the required container image and has enough disk, memory, and CPU capacity for the configured limits.

### Panel Is in Maintenance Mode

Check whether an administrator intentionally enabled maintenance mode or an update stopped after entering maintenance. Review the deployment output and Laravel logs before bringing a partially updated production panel back online.

## Development and Building Assets

If you want to modify the frontend (React/TypeScript/Tailwind) or rebuild the compiled assets shipped in a release, see [BUILDING.md](BUILDING.md) for the Node.js/Yarn toolchain, the `yarn run watch`/`yarn run serve` workflows, and instructions for running Wings locally for development.

Release archives (such as the included `ponkodactyl-v1.15.1.tar.gz`) are produced with [`build-ponkodactyl-release.sh`](build-ponkodactyl-release.sh), which builds production assets and packages the application, excluding local environment files, dependencies, and storage.

## Contributing

Bug reports, feature suggestions, and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines, and check [CHANGELOG.md](CHANGELOG.md) for a history of notable changes in this fork.

## Security and Support

- Keep `APP_DEBUG=false` and use HTTPS for internet-facing panels.
- Never enable local debug auto-login on a public or shared system.
- Protect panel administrator accounts with strong unique passwords and two-factor authentication.
- Issue API keys with the narrowest required permissions and revoke keys that are no longer needed.
- Restrict database, Redis, and Wings access; do not publish their credentials or configuration files.
- Report vulnerabilities privately using the process in [SECURITY.md](SECURITY.md), not in public issues.

## License

See [LICENSE.md](LICENSE.md) for license information.
