# Ponkodactyl Static Demo

This is a standalone, browser-only demo. It does not require PHP, Laravel, a database, or a build step.

## Host it

Upload the contents of this directory to the document root of any static web host. `index.html` is the entry point. For local testing, serve this directory with any static file server, such as:

```bash
php -S 127.0.0.1:8080 -t demo-site
```

Then open `http://127.0.0.1:8080`.

## Sample sign-ins

- Client: `client@demo.test` / `mossy-client`
- Admin: `admin@demo.test` / `mossy-admin`

These are public demo credentials, not real accounts. The role switch is only a UI simulation and is not an authentication or authorization system.

## Feature coverage

Screen names follow the panel's current client and admin navigation. The client preview includes the server list, server dashboard/console, files, databases, schedules, subusers, backups, network allocations, startup variables, server settings/activity, and account, API credential, SSH key, and account activity screens. The admin preview includes the control-room overview, settings, application API keys, database hosts, locations, nodes, servers, users, mounts, and nests.

These screens use representative sample records. Controls demonstrate the corresponding panel workflows in memory; they do not contact Wings, create real resources, execute commands, or change the installed panel.

## Data isolation

All editable sample data exists only in the current page's JavaScript memory. There are no API requests, cookies, local storage, session storage, or shared database. A refresh, logout, or separate browser tab starts from the original sample data, so one visitor's edits cannot carry over to another.

Do not use this static demo to protect real data or connect it to a production panel. For real multi-user testing, use an isolated backend with per-user authorization and resettable test data.