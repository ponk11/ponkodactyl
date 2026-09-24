you the power to run game servers without bloating machines with a host of additional dependencies.
# Ponkodactyl

Ponkodactyl is a deliberately chaotic rebrand of the Pterodactyl panel: green horror vibes, absurd UI, useful dashboard tools, and enough absurd extras to make the admin panel feel like a haunted control room from a late-night Minecraft stream.

This fork keeps the underlying Pterodactyl structure but overlays it with a louder, goofier, more feature-rich control panel experience for local hosting, experimentation, and weirdly fun server management.

## Highlights

- Green-tinted horror aesthetic with a warped, low-visibility control-center look
- More dashboard widgets and quick controls layered into the panel shell
- “Ponk mode” behavior that intentionally makes the UI feel slightly cursed
- Local dev convenience auto-login so you can inspect the full panel without the normal auth gate
- Custom branding and metadata for the Ponkodactyl fork

## Local development setup

### 1) Install dependencies

```bash
composer install --no-interaction --ignore-platform-reqs
yarn install --frozen-lockfile
```

### 2) Prepare the local database

```bash
cp .env.example .env 2>/dev/null || true
touch database/database.sqlite
php artisan key:generate
php artisan migrate --force
```

### 3) Run the app

```bash
php artisan serve --host 0.0.0.0 --port 8000
```

Open http://localhost:8000 in your browser.

> In local debug mode, the app will automatically sign in with the first available admin user so the full dashboard can be previewed quickly.

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
