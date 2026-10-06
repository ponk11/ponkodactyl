# Ponkodactyl

Ponkodactyl is a Pterodactyl Panel fork for managing game-server users, nodes, allocations, server definitions, and server records. Wings runs on each node and performs the actual container and game-server work; Ponkodactyl does not replace Wings.

## Requirements

- PHP 8.2 or 8.3 with the extensions required by Pterodactyl, including `pdo_mysql`
- MySQL or MariaDB
- A supported web server and Redis configuration
- Wings installed and configured on nodes that will run game servers

## Upgrade an Existing Panel

This fork is based on upstream Pterodactyl `v1.15.1`. For a production upgrade, use a release archive with the provided guarded deployment scripts. The updater verifies production settings and the panel hostname, backs up the panel files and database, applies migrations, restarts queue workers, and preserves the existing `.env`, `APP_KEY`, storage, uploads, database, web server, Redis, and Wings configuration.

Deployment is manual and starts only when an operator chooses to release an update. If an update fails, the script stops and reports the recovery backup location. Do not use the production updater for a test installation. Back up the database before making changes, and never run `git pull`, `migrate:fresh`, or `db:seed` against a live panel.

## Provision a Server

Creating a server requires a configured Location, a Node connected to Wings, and an available allocation. Choose the appropriate game-server definition (Nest and Egg) while creating the server. Do not connect a second panel to a production Wings node.

## Security

Set `APP_ENV=production` and `APP_DEBUG=false` on internet-facing installations. Never enable local debug auto-login on a public or shared server. Keep backups current and protect panel, database, Redis, and Wings credentials.

## License

See [LICENSE.md](LICENSE.md) for license information.
