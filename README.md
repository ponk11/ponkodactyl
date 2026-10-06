# Ponkodactyl

Ponkodactyl is a Pterodactyl Panel fork with a deliberately chaotic interface, useful server-management tools, and a haunted-control-room sense of humor. It is intended for panel operators and developers, not only for the original author's machine.

The panel manages users, nodes, allocations, game-server definitions, and server records. Wings runs on each node and performs the actual container and game-server work. Ponkodactyl does not replace Wings.

## Highlights

- Green-tinted horror aesthetic with a warped, low-visibility control-center look
- More dashboard widgets and quick controls layered into the panel shell
- “Ponk mode” behavior that intentionally makes the UI feel slightly cursed
- Local dev convenience auto-login so you can inspect the full panel without the normal auth gate
- Custom branding and metadata for the Ponkodactyl fork

## Requirements

- PHP 8.2 or 8.3 with the extensions required by Pterodactyl, including `pdo_mysql`
- MySQL or MariaDB for panel data
- Composer
- Node.js 22 or newer and Yarn 1 to build frontend assets from source
- A web server and Redis for a normal deployed panel
- Wings on a configured node to create and run real game servers

## Existing Panel Upgrade

If Ponkodactyl is replacing the panel already serving your domain, this is an upgrade of that panel, not a second installation. Keep its existing `.env`, `APP_KEY`, database, storage, web-server configuration, queue workers, and Wings node. Do not create a new database or run `migrate:fresh` for an in-place upgrade. Back up the panel files, `.env`, storage, and database first, verify the installed panel version is compatible with this branch, then deploy the fork into the existing panel web root and run its migrations once.

Compatibility warning: this checkout's changelog currently tops out at Pterodactyl `v1.12.3`. Do not replace a panel reporting a newer or custom version (such as `1.15.1`) until you have confirmed its source lineage and tested the fork against a backup of its database. Matching PHP or Laravel versions alone does not prove database compatibility.

Some Pterodactyl installs are deployed from release archives and do not contain a `.git` directory; that is normal. In that case, compare the installed `CHANGELOG.md` and `composer.lock` with this fork instead of relying on `git remote` or the `config/app.php` version label alone.

For a public panel, keep `APP_ENV=production` and `APP_DEBUG=false`, and retain the current `APP_URL` and database connection. Never use the local preview auto-login settings on a public host. Do not run two active panels against the same database or Wings node.

## Isolated Test VPS Install

Use this only when you want a separate test copy beside an existing panel. It uses a new database and a private SSH tunnel; it does not replace the existing panel. Do not copy the existing panel's `.env`, reuse its production database, or connect this test panel to a production Wings node. A second panel sharing the same Wings node can conflict with the production panel.

These commands assume Ubuntu or Debian, an existing MySQL/MariaDB service, and the PHP extensions used by the installed Pterodactyl panel.

### 1) Create an isolated database

First open a MySQL/MariaDB client from the VPS shell. Use whichever client is installed:

```bash
sudo mariadb
# or, on installations with the MySQL client:
sudo mysql
```

Run the SQL below **at the database prompt**, not at the Linux shell prompt. Replace the example password with a unique one:

```sql
CREATE DATABASE ponkodactyl_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ponkodactyl_test'@'localhost' IDENTIFIED BY 'REPLACE_WITH_A_UNIQUE_PASSWORD';
GRANT ALL PRIVILEGES ON ponkodactyl_test.* TO 'ponkodactyl_test'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Do not use the example password literally. Choose a unique password and put the same value in the test `.env` file.

If both `mariadb` and `mysql` return `command not found`, install only the client (`sudo apt install mariadb-client`) or use the database container's client, for example `docker exec -it <database-container> mariadb -uroot -p`. Do not install a second database server over the one already used by Pterodactyl.

### 2) Clone and build a separate panel copy

```bash
sudo mkdir -p /var/www/ponkodactyl-test
sudo chown "$USER":"$USER" /var/www/ponkodactyl-test
git clone --branch 1.0-develop https://github.com/ponk11/ponkodactyl.git /var/www/ponkodactyl-test
cd /var/www/ponkodactyl-test
cp .env.example .env
nano .env
```

Edit `.env` and set a new app name, the loopback URL, and the isolated database credentials:

```dotenv
APP_NAME=Ponkodactyl-Test
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8081
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ponkodactyl_test
DB_USERNAME=ponkodactyl_test
DB_PASSWORD=REPLACE_WITH_A_UNIQUE_PASSWORD
CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
```

Install Node.js 22 and Yarn 1 to build this source checkout's frontend assets:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install --global yarn@1.22.22
```

Install PHP dependencies without running Laravel hooks before the app key exists, then finish bootstrapping and build the assets:

```bash
composer install --no-dev --no-interaction --optimize-autoloader --no-scripts
php artisan key:generate --force
composer dump-autoload --optimize
yarn install --frozen-lockfile
yarn build:production
```

Keep this debug configuration bound to loopback and accessed only through SSH. Then initialize the separate database:

```bash
php artisan migrate --force
php artisan db:seed --force
php artisan storage:link
php artisan serve --host 127.0.0.1 --port 8081
```

From your computer, open an SSH tunnel in a second terminal and visit the local URL:

```bash
ssh -L 8081:127.0.0.1:8081 <ssh-user>@<vps-address>
```

Open `http://127.0.0.1:8081/auth/login`. The seeder imports the default Nests and Eggs; local debug mode creates a preview admin when needed. This test copy is not internet-facing and does not replace the existing panel.

## Creating a Starter Server

The admin shortcut opens the normal Pterodactyl server-creation workflow. The seeded Eggs provide game definitions, but creating a runnable server also requires a Location, a Node connected to Wings, and an available allocation. Configure these on a test Wings node before provisioning. Do not attach the existing production Wings node to a second panel.

## Local development setup

The panel can run at `http://localhost:8000` without Redis or Wings for UI development. To control real game servers, install and configure Wings separately and connect a node to the panel.

### 1) Install dependencies

```bash
composer install --no-interaction --ignore-platform-reqs --no-scripts
yarn install --frozen-lockfile
```

For local development, use PHP 8.2 or 8.3 with the SQLite PDO extension, Composer, Node.js 22 or newer, and Yarn 1.

### 2) Configure the local environment

```bash
cp .env.example .env
touch database/database.sqlite
```

Edit `.env` and set these values (use the absolute path to `database/database.sqlite`):

```dotenv
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/ponkodactyl/database/database.sqlite
CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
```

Then initialize the app:

```bash
php artisan key:generate
composer dump-autoload --optimize
php artisan migrate --force
```

### 3) Run the app

```bash
php artisan serve --host 0.0.0.0 --port 8000
```

Open http://localhost:8000 in your browser. In local debug mode, visiting the login route signs in the local preview administrator and redirects to the dashboard.

When running in a Codespace or remote container, use the **Ports** panel to open forwarded port `8000` in the browser. The container's `localhost` is not the same as your desktop's `localhost`.

> Never enable `APP_DEBUG=true` or local auto-login on a public or shared server.

## Default local admin

If no user exists yet, the debug auto-login flow creates one automatically:

- Username: `ponkadmin`
- Email: `ponkadmin@ponkodactyl.local`
- Password: `password`

If a real admin already exists, that account is used instead.

## Useful commands

```bash
php artisan test
yarn test --runInBand resources/scripts/lib/helpers.spec.ts
yarn tsc --noEmit
yarn lint
```

## Notes

This repository is intentionally styled as a playful, custom fork of Pterodactyl rather than a clean upstream reset. It is optimized for local experimentation, visual chaos, and practical server-panel workflows while keeping the underlying Laravel + React structure intact.

## License

This project remains under the MIT-style licensing model used by the base project. See [LICENSE.md](LICENSE.md) for details.
