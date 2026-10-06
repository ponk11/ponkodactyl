(() => {
    const accounts = {
        'client@demo.test': { password: 'mossy-client', role: 'client', label: 'avery.client' },
        'admin@demo.test': { password: 'mossy-admin', role: 'admin', label: 'ponk.admin' },
    };

    const loginScreen = document.getElementById('login-screen');
    const appShell = document.getElementById('app-shell');
    const loginForm = document.getElementById('login-form');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const loginError = document.getElementById('login-error');
    const navList = document.getElementById('nav-list');
    const pageContent = document.getElementById('page-content');
    const userBadge = document.getElementById('user-badge');
    const editDialog = document.getElementById('edit-dialog');
    const editForm = document.getElementById('edit-form');
    const dialogTitle = document.getElementById('dialog-title');
    const dialogFields = document.getElementById('dialog-fields');
    const toast = document.getElementById('toast');

    let session = null;
    let state = null;
    let activePage = 'overview';
    let selectedServer = false;
    let toastTimer;

    const freshState = () => ({
        server: { id: 'server-1', name: 'Mossy Outpost', owner: 'avery.client', status: 'Online', address: 'mc.example.test:25565', memory: '8 GB' },
        servers: [
            { id: 'server-1', name: 'Mossy Outpost', owner: 'avery.client', node: 'eu-node-01', status: 'Online', memory: '8 GB' },
            { id: 'server-2', name: 'Night Shift', owner: 'jamie.user', node: 'eu-node-01', status: 'Online', memory: '6 GB' },
            { id: 'server-3', name: 'Quiet Quarry', owner: 'sam.builds', node: 'us-node-02', status: 'Online', memory: '4 GB' },
        ],
        files: [
            { id: 'file-1', name: 'server.properties', content: 'motd=A quiet place to build\nmax-players=20\nonline-mode=true' },
            { id: 'file-2', name: 'README.txt', content: 'Welcome to Mossy Outpost.\nKeep the lanterns lit.' },
            { id: 'file-3', name: 'latest.log', content: '[10:42:08] Done! Type "help" for help.\n[10:43:02] Avery joined the game.' },
        ],
        users: [
            { id: 'user-1', username: 'avery.client', email: 'avery@example.test', role: 'Client' },
            { id: 'user-2', username: 'jamie.user', email: 'jamie@example.test', role: 'Client' },
            { id: 'user-3', username: 'sam.builds', email: 'sam@example.test', role: 'Client' },
            { id: 'user-4', username: 'ponk.admin', email: 'admin@example.test', role: 'Administrator' },
        ],
        nodes: [
            { id: 'node-1', name: 'eu-node-01', location: 'Frankfurt, DE', fqdn: 'node-01.example.test', daemon: '8080', memory: '65536 MB' },
            { id: 'node-2', name: 'us-node-02', location: 'Hillsboro, US', fqdn: 'node-02.example.test', daemon: '8080', memory: '65536 MB' },
        ],
        locations: [
            { id: 'location-1', short: 'FRA', description: 'Frankfurt, Germany' },
            { id: 'location-2', short: 'HIL', description: 'Hillsboro, United States' },
        ],
        databaseHosts: [{ id: 'database-host-1', name: 'primary-mysql', host: 'db-01.example.test', port: '3306' }],
        mounts: [{ id: 'mount-1', name: 'Shared assets', source: '/mnt/assets', target: '/home/container/assets' }],
        nests: [{ id: 'nest-1', name: 'Minecraft', eggs: 'Paper, Vanilla' }, { id: 'nest-2', name: 'Source Games', eggs: 'Counter-Strike' }],
        adminApiKeys: [{ id: 'admin-key-1', description: 'Local tooling', user: 'ponk.admin' }],
        adminSettings: [{ id: 'setting-1', section: 'General', setting: 'Panel name', value: 'Ponkodactyl Demo' }, { id: 'setting-2', section: 'Mail', setting: 'Mail driver', value: 'SMTP' }, { id: 'setting-3', section: 'Advanced', setting: 'Maintenance mode', value: 'Off' }],
        client: {
            databases: [{ id: 'client-db-1', name: 'mossy_world', username: 'u_mossy', host: 'db-01.example.test' }],
            schedules: [{ id: 'schedule-1', name: 'Daily restart', cron: '0 4 * * *', enabled: 'Enabled' }],
            subusers: [{ id: 'subuser-1', username: 'jamie.user', email: 'jamie@example.test', permissions: 'Console, Files' }],
            backups: [{ id: 'backup-1', name: 'before-the-big-build', size: '1.8 GB', created: 'Today, 09:15', locked: 'No' }],
            allocations: [{ id: 'allocation-1', ip: '203.0.113.24', port: '25565', alias: 'mc.example.test', primary: 'Yes' }],
            startup: [{ id: 'startup-1', variable: 'SERVER_JARFILE', value: 'paper.jar' }, { id: 'startup-2', variable: 'SERVER_MEMORY', value: '8192' }],
            serverActivity: [{ id: 'server-activity-1', action: 'Server started', time: 'Today, 10:42' }, { id: 'server-activity-2', action: 'Backup completed', time: 'Today, 09:15' }],
            account: [{ id: 'account-1', setting: 'Email', value: 'avery@example.test' }, { id: 'account-2', setting: 'Two-factor authentication', value: 'Enabled' }],
            apiKeys: [{ id: 'api-key-1', name: 'Local tooling', created: 'Oct 01, 2026' }],
            sshKeys: [{ id: 'ssh-key-1', name: 'Workstation', fingerprint: 'SHA256:demo-fingerprint' }],
            accountActivity: [{ id: 'account-activity-1', action: 'Signed in', time: 'Today, 10:42' }, { id: 'account-activity-2', action: 'Updated account email', time: 'Yesterday' }],
        },
        console: [
            '[10:42:08] Done (4.821s)! For help, type "help"',
            '[10:42:11] There are 6 of a max of 20 players online.',
            '[10:43:02] Avery joined the game',
        ],
    });

    const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character]);

    const showToast = (message) => {
        toast.textContent = message;
        toast.classList.add('is-visible');
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2400);
    };

    const makeId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

    const navItems = () => {
        if (session.role === 'admin') {
            return [
                ['overview', 'Overview'], ['settings', 'Settings'], ['api', 'API'], ['databases', 'Databases'],
                ['locations', 'Locations'], ['nodes', 'Nodes'], ['servers', 'Servers'], ['users', 'Users'],
                ['mounts', 'Mounts'], ['nests', 'Nests'],
            ];
        }

        return selectedServer
            ? [
                  ['back-home', 'All servers'], ['server-console', 'Dashboard'], ['files', 'Files'], ['client-databases', 'Databases'],
                  ['schedules', 'Schedules'], ['subusers', 'Users'], ['backups', 'Backups'], ['network', 'Network'],
                  ['startup', 'Startup'], ['server-settings', 'Settings'], ['server-activity', 'Activity'],
              ]
            : [
                  ['overview', 'Dashboard'], ['account', 'Account'], ['account-api', 'API Credentials'],
                  ['ssh', 'SSH Keys'], ['account-activity', 'Activity'],
              ];
    };

    const renderNav = () => {
        document.getElementById('side-caption').textContent = session.role === 'admin'
            ? 'Administration'
            : selectedServer ? state.server.name : 'Client area';
        navList.innerHTML = navItems().map(([id, label], index) => `
            <button class="nav-button" type="button" data-page="${id}" aria-current="${activePage === id ? 'page' : 'false'}">
                <span class="nav-glyph">${String(index + 1).padStart(2, '0')}</span>${label}
            </button>`).join('');
    };

    const pageHead = (kicker, title, subtitle, action = '') => `
        <div class="page-head"><div><p class="eyebrow">${kicker}</p><h1>${title}</h1><p class="subhead">${subtitle}</p></div>${action}</div>`;

    const stat = (label, value, suffix = '') => `
        <article class="stat"><div class="stat-label">${label}</div><div class="stat-value">${value}<small>${suffix}</small></div></article>`;

    const renderClientDashboard = () => `
        ${pageHead('Client panel / server list', 'Your servers.', 'Select a server to open its dashboard.')}
        <section class="surface table-wrap"><table><thead><tr><th>Server</th><th>Node</th><th>Allocation</th><th>Status</th></tr></thead><tbody>
            ${state.servers.filter((server) => server.owner === session.label).map((server) => `<tr><td><button class="text-button" type="button" data-open-server="${escapeHtml(server.id)}">${escapeHtml(server.name)}</button></td><td>${escapeHtml(server.node)}</td><td>${escapeHtml(state.server.address)}</td><td class="table-status">${escapeHtml(server.status)}</td></tr>`).join('') || '<tr><td colspan="4" class="empty-state">No servers are assigned to this sample account.</td></tr>'}
        </tbody></table></section>`;

    const renderServerConsole = () => {
        const online = state.server.status === 'Online';
        const statusClass = online ? '' : 'is-offline';
        return `
            ${pageHead('Server dashboard / console', escapeHtml(state.server.name), 'Resource usage and power controls for this sample server.', `<span class="status-pill ${statusClass}"><span class="status-dot"></span>${escapeHtml(state.server.status)}</span>`)}
            <div class="grid stats">
                ${stat('CPU usage', '24', '%')}${stat('Memory', '3.2', ' / 8 GB')}${stat('Disk usage', '18', ' / 40 GB')}${stat('Network', '1.4', ' MB/s')}
            </div>
            <div class="grid columns">
                <section class="surface">
                    <div class="surface-head"><h2>Server overview</h2><span class="eyebrow">Minecraft / Paper</span></div>
                    <div class="surface-body">
                        <p class="server-name">${escapeHtml(state.server.name)}</p><p class="server-meta">${escapeHtml(state.server.address)} / Frankfurt, DE</p>
                        <div class="metric-line"><span>CPU</span><strong>24%</strong></div><div class="meter"><div class="meter-fill" style="width:24%"></div></div>
                        <div class="metric-line"><span>Memory</span><strong>3.2 GB / 8 GB</strong></div><div class="meter"><div class="meter-fill" style="width:40%"></div></div>
                        <div class="action-row">
                            <button class="button button-primary" type="button" data-server-action="start" ${online ? 'disabled' : ''}>Start</button>
                            <button class="button button-danger" type="button" data-server-action="stop" ${online ? '' : 'disabled'}>Stop</button>
                            <button class="button" type="button" data-server-action="restart">Restart</button>
                        </div>
                    </div>
                </section>
                <section class="surface"><div class="surface-head"><h2>Console</h2><span class="eyebrow">Websocket preview</span></div><div class="surface-body">
                    <div class="console" id="console-output" aria-live="polite">${state.console.map((line) => `<div class="console-line">${escapeHtml(line)}</div>`).join('')}</div>
                    <form class="console-form" id="console-form"><input id="console-input" type="text" placeholder="Try: help" autocomplete="off" aria-label="Sample console command"><button class="button button-primary" type="submit">Send</button></form>
                </div></section>
            </div>`;
    };

    const renderFiles = () => `
        ${pageHead('Server / files', 'Files', 'Edit or add sample files. Changes last only for this session.', '<button class="button button-primary" type="button" data-action="new-file">New file</button>')}
        <section class="surface table-wrap"><table><thead><tr><th>Name</th><th>Type</th><th>Size</th><th>Actions</th></tr></thead><tbody>
            ${state.files.length ? state.files.map((file) => `<tr><td>${escapeHtml(file.name)}</td><td>${file.name.endsWith('.log') ? 'Log file' : 'File'}</td><td>${Math.max(1, Math.round(file.content.length / 1024))} KB</td><td><div class="table-actions"><button class="button" type="button" data-action="edit-file" data-id="${escapeHtml(file.id)}">Edit</button><button class="button button-danger" type="button" data-action="delete-file" data-id="${escapeHtml(file.id)}">Delete</button></div></td></tr>`).join('') : '<tr><td colspan="4" class="empty-state">No sample files. Add one to try the editor.</td></tr>'}
        </tbody></table></section>`;

    const renderAdminOverview = () => `
        ${pageHead('Administration / panel totals', 'Control room', 'Manage the resources configured for this panel.')}
        <div class="grid stats">${stat('Servers', String(state.servers.length))}${stat('Nodes', String(state.nodes.length))}${stat('Users', String(state.users.length))}${stat('Locations', String(state.locations.length))}</div>
        <section class="surface"><div class="surface-head"><h2>Admin shortcuts</h2></div><div class="surface-body action-row">
            <button class="button" type="button" data-action="new-record" data-collection="admin-locations">Set up a location</button>
            <button class="button" type="button" data-action="new-record" data-collection="admin-nodes">Add a node</button>
            <button class="button" type="button" data-action="new-server">Provision a server</button>
            <button class="button" type="button" data-action="new-user">Create a user</button>
            <button class="button" type="button" data-action="new-record" data-collection="admin-nests">Add a nest</button>
            <button class="button" type="button" data-action="new-record" data-collection="admin-api">Create an API key</button>
        </div></section>
        <section class="surface" style="margin-top:14px"><div class="surface-head"><h2>Current build</h2><span class="eyebrow">Sample panel</span></div><div class="surface-body">
            <p class="server-meta">Ponkodactyl 1.15.1 / static preview. Build status is sample content, not a live version check.</p>
            <div class="action-row"><a class="button" href="https://pterodactyl.io" target="_blank" rel="noopener noreferrer">Documentation</a><a class="button" href="https://github.com/pterodactyl/panel" target="_blank" rel="noopener noreferrer">Upstream project</a></div>
        </div></section>`;

    const renderServers = () => `
        ${pageHead('Administration / inventory', 'Servers', 'Create, edit, or remove sample server records.', '<button class="button button-primary" type="button" data-action="new-server">Create server</button>')}
        <section class="surface table-wrap"><table><thead><tr><th>Server</th><th>Owner</th><th>Node</th><th>Memory</th><th>Status</th><th>Actions</th></tr></thead><tbody>
            ${state.servers.length ? state.servers.map((server) => `<tr><td>${escapeHtml(server.name)}</td><td>${escapeHtml(server.owner)}</td><td>${escapeHtml(server.node)}</td><td>${escapeHtml(server.memory)}</td><td class="table-status">${escapeHtml(server.status)}</td><td><div class="table-actions"><button class="button" type="button" data-action="edit-server" data-id="${escapeHtml(server.id)}">Edit</button><button class="button button-danger" type="button" data-action="delete-server" data-id="${escapeHtml(server.id)}">Delete</button></div></td></tr>`).join('') : '<tr><td colspan="6" class="empty-state">No sample servers. Create one to try the admin controls.</td></tr>'}
        </tbody></table></section>`;

    const renderUsers = () => `
        ${pageHead('Administration / accounts', 'Users', 'Edit or add sample user records.', '<button class="button button-primary" type="button" data-action="new-user">Create user</button>')}
        <section class="surface table-wrap"><table><thead><tr><th>Username</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead><tbody>
            ${state.users.map((user) => `<tr><td>${escapeHtml(user.username)}</td><td>${escapeHtml(user.email)}</td><td>${escapeHtml(user.role)}</td><td><div class="table-actions"><button class="button" type="button" data-action="edit-user" data-id="${escapeHtml(user.id)}">Edit</button><button class="button button-danger" type="button" data-action="delete-user" data-id="${escapeHtml(user.id)}">Delete</button></div></td></tr>`).join('')}
        </tbody></table></section>`;

    const resourcePages = {
        'admin-settings': { title: 'Settings', description: 'General, mail, and advanced panel settings.', collection: 'adminSettings', columns: [['section', 'Section'], ['setting', 'Setting'], ['value', 'Value']], fields: [['value', 'Value']], canCreate: false, canDelete: false },
        'admin-api': { title: 'Application API', description: 'Create and revoke application API credentials.', collection: 'adminApiKeys', columns: [['description', 'Description'], ['user', 'User']], fields: [['description', 'Description']], createLabel: 'Create API key', canEdit: false },
        'admin-databases': { title: 'Database Hosts', description: 'Configure database hosts available to servers.', collection: 'databaseHosts', columns: [['name', 'Name'], ['host', 'Host'], ['port', 'Port']], fields: [['name', 'Name'], ['host', 'Host'], ['port', 'Port']], createLabel: 'Add database host' },
        'admin-locations': { title: 'Locations', description: 'Group nodes by deployment location.', collection: 'locations', columns: [['short', 'Short code'], ['description', 'Description']], fields: [['short', 'Short code'], ['description', 'Description']], createLabel: 'Add location' },
        'admin-nodes': { title: 'Nodes', description: 'Manage Wings nodes and their locations.', collection: 'nodes', columns: [['name', 'Name'], ['location', 'Location'], ['fqdn', 'FQDN'], ['daemon', 'Daemon port'], ['memory', 'Memory']], fields: [['name', 'Name'], ['location', 'Location'], ['fqdn', 'FQDN'], ['daemon', 'Daemon port'], ['memory', 'Memory']], createLabel: 'Create node' },
        'admin-mounts': { title: 'Mounts', description: 'Manage shared mount definitions.', collection: 'mounts', columns: [['name', 'Name'], ['source', 'Source'], ['target', 'Target']], fields: [['name', 'Name'], ['source', 'Source'], ['target', 'Target']], createLabel: 'Create mount' },
        'admin-nests': { title: 'Nests', description: 'Organize game server Eggs and configurations.', collection: 'nests', columns: [['name', 'Name'], ['eggs', 'Eggs']], fields: [['name', 'Name'], ['eggs', 'Eggs']], createLabel: 'Create nest' },
        'client-databases': { title: 'Databases', description: 'Manage databases attached to this server.', collection: 'client.databases', columns: [['name', 'Database'], ['username', 'Username'], ['host', 'Host']], fields: [['name', 'Database']], createLabel: 'Create database', canEdit: false },
        'client-schedules': { title: 'Schedules', description: 'Configure recurring server tasks.', collection: 'client.schedules', columns: [['name', 'Name'], ['cron', 'Cron expression'], ['enabled', 'Status']], fields: [['name', 'Name'], ['cron', 'Cron expression'], ['enabled', 'Status']], createLabel: 'Create schedule' },
        'client-subusers': { title: 'Users', description: 'Manage subusers and their server permissions.', collection: 'client.subusers', columns: [['username', 'Username'], ['email', 'Email'], ['permissions', 'Permissions']], fields: [['email', 'Email'], ['permissions', 'Permissions']], createLabel: 'Add subuser' },
        'client-backups': { title: 'Backups', description: 'Create, lock, restore, download, or delete server backups.', collection: 'client.backups', columns: [['name', 'Name'], ['size', 'Size'], ['created', 'Created'], ['locked', 'Locked']], fields: [['name', 'Backup name']], createLabel: 'Create backup', canEdit: false },
        'client-network': { title: 'Network', description: 'Manage server allocations and the primary allocation.', collection: 'client.allocations', columns: [['ip', 'IP address'], ['port', 'Port'], ['alias', 'Alias'], ['primary', 'Primary']], fields: [['alias', 'Alias']], createLabel: 'Add allocation' },
        'client-startup': { title: 'Startup', description: 'Review and edit permitted startup variables.', collection: 'client.startup', columns: [['variable', 'Variable'], ['value', 'Current value']], fields: [['variable', 'Variable'], ['value', 'Current value']], canCreate: false, canDelete: false },
        'client-server-activity': { title: 'Activity', description: 'Recent activity for this server.', collection: 'client.serverActivity', columns: [['action', 'Activity'], ['time', 'Time']], readOnly: true },
        'client-account': { title: 'Account', description: 'Review account details and security settings.', collection: 'client.account', columns: [['setting', 'Setting'], ['value', 'Value']], fields: [['value', 'Value']], canCreate: false, canDelete: false },
        'client-account-api': { title: 'API Credentials', description: 'Create and revoke client API credentials.', collection: 'client.apiKeys', columns: [['name', 'Description'], ['created', 'Created']], fields: [['name', 'Description']], createLabel: 'Create API key', canEdit: false },
        'client-ssh': { title: 'SSH Keys', description: 'Manage SSH keys associated with this account.', collection: 'client.sshKeys', columns: [['name', 'Name'], ['fingerprint', 'Fingerprint']], fields: [['name', 'Name'], ['publicKey', 'Public key']], createLabel: 'Add SSH key', canEdit: false },
        'client-account-activity': { title: 'Activity', description: 'Recent account activity.', collection: 'client.accountActivity', columns: [['action', 'Activity'], ['time', 'Time']], readOnly: true },
    };

    const resolveCollection = (path) => path.split('.').reduce((value, key) => value[key], state);

    const renderCollectionPage = (page) => {
        const definition = resourcePages[page];
        const items = resolveCollection(definition.collection);
        const canCreate = definition.canCreate !== false && !definition.readOnly;
        const action = canCreate
            ? `<button class="button button-primary" type="button" data-action="new-record" data-collection="${page}">${definition.createLabel || 'Create'}</button>`
            : '';
        const headings = definition.columns.map(([, label]) => `<th>${escapeHtml(label)}</th>`).join('');
        const rows = items.map((item) => {
            const cells = definition.columns.map(([key]) => `<td>${escapeHtml(item[key])}</td>`).join('');
            const controls = definition.readOnly ? '' : `<td><div class="table-actions">${definition.canEdit !== false ? `<button class="button" type="button" data-action="edit-record" data-collection="${page}" data-id="${escapeHtml(item.id)}">Edit</button>` : ''}${page === 'client-backups' ? `<button class="button" type="button" data-action="restore-backup" data-id="${escapeHtml(item.id)}">Restore</button><button class="button" type="button" data-action="toggle-backup-lock" data-id="${escapeHtml(item.id)}">${item.locked === 'Yes' ? 'Unlock' : 'Lock'}</button>` : ''}${page === 'client-databases' ? `<button class="button" type="button" data-action="rotate-database" data-id="${escapeHtml(item.id)}">Rotate password</button>` : ''}${page === 'client-schedules' ? `<button class="button" type="button" data-action="run-schedule" data-id="${escapeHtml(item.id)}">Run now</button>` : ''}${page === 'client-network' ? `<button class="button" type="button" data-action="set-primary" data-id="${escapeHtml(item.id)}">Set primary</button>` : ''}${definition.canDelete !== false ? `<button class="button button-danger" type="button" data-action="delete-record" data-collection="${page}" data-id="${escapeHtml(item.id)}">${page === 'client-account-api' || page === 'admin-api' ? 'Revoke' : 'Delete'}</button>` : ''}</div></td>`;
            return `<tr>${cells}${definition.readOnly ? '' : controls}</tr>`;
        }).join('');
        const actionHeading = definition.readOnly ? '' : '<th>Actions</th>';
        const emptyColumns = definition.columns.length + (definition.readOnly ? 0 : 1);

        return `${pageHead(session.role === 'admin' ? 'Administration / sample records' : selectedServer ? 'Server / sample records' : 'Account / sample records', definition.title, definition.description, action)}
            <section class="surface table-wrap"><table><thead><tr>${headings}${actionHeading}</tr></thead><tbody>${rows || `<tr><td colspan="${emptyColumns}" class="empty-state">No sample records. Create one to try this panel feature.</td></tr>`}</tbody></table></section>`;
    };

    const renderServerSettings = () => `
        ${pageHead('Server / settings', 'Settings', 'Rename this server, change its Docker image, or reinstall it.')}
        <section class="surface"><div class="surface-head"><h2>${escapeHtml(state.server.name)}</h2></div><div class="surface-body action-row">
            <button class="button" type="button" data-action="edit-current-server">Rename server</button>
            <button class="button" type="button" data-toast="Docker image selection is simulated; no image was changed.">Change Docker image</button>
            <button class="button button-danger" type="button" data-action="reinstall-server">Reinstall server</button>
        </div></section>`;

    const render = () => {
        if (!session) return;
        renderNav();
        userBadge.textContent = `${session.label} / ${session.role}`;
        const pages = session.role === 'admin'
            ? {
                  overview: renderAdminOverview,
                  settings: () => renderCollectionPage('admin-settings'),
                  api: () => renderCollectionPage('admin-api'),
                  databases: () => renderCollectionPage('admin-databases'),
                  locations: () => renderCollectionPage('admin-locations'),
                  nodes: () => renderCollectionPage('admin-nodes'),
                  servers: renderServers,
                  users: renderUsers,
                  mounts: () => renderCollectionPage('admin-mounts'),
                  nests: () => renderCollectionPage('admin-nests'),
              }
            : selectedServer
              ? {
                    'back-home': renderClientDashboard,
                    'server-console': renderServerConsole,
                    files: renderFiles,
                    'client-databases': () => renderCollectionPage('client-databases'),
                    schedules: () => renderCollectionPage('client-schedules'),
                    subusers: () => renderCollectionPage('client-subusers'),
                    backups: () => renderCollectionPage('client-backups'),
                    network: () => renderCollectionPage('client-network'),
                    startup: () => renderCollectionPage('client-startup'),
                    'server-settings': renderServerSettings,
                    'server-activity': () => renderCollectionPage('client-server-activity'),
                }
              : {
                    overview: renderClientDashboard,
                    account: () => renderCollectionPage('client-account'),
                    'account-api': () => renderCollectionPage('client-account-api'),
                    ssh: () => renderCollectionPage('client-ssh'),
                    'account-activity': () => renderCollectionPage('client-account-activity'),
                };
        if (!pages[activePage]) activePage = session.role === 'admin' || !selectedServer ? 'overview' : 'server-console';
        pageContent.innerHTML = pages[activePage]();
    };

    const startSession = (account) => {
        session = account;
        state = freshState();
        activePage = 'overview';
        selectedServer = false;
        loginError.hidden = true;
        loginScreen.hidden = true;
        appShell.hidden = false;
        render();
    };

    const signOut = () => {
        session = null;
        state = null;
        activePage = 'overview';
        selectedServer = false;
        appShell.hidden = true;
        loginScreen.hidden = false;
        loginForm.reset();
        loginError.hidden = true;
        loginEmail.focus();
    };

    const field = (label, name, value = '', type = 'text') => `
        <label class="field-group"><span class="field-label">${label}</span><input name="${name}" type="${type}" value="${escapeHtml(value)}" required></label>`;

    const openEditor = (type, item = null) => {
        editForm.dataset.type = type;
        editForm.dataset.id = item?.id || '';
        const isNew = !item;
        if (type === 'file') {
            dialogTitle.textContent = isNew ? 'Add sample file' : 'Edit sample file';
            dialogFields.innerHTML = `${field('File name', 'name', item?.name || '')}<label class="field-group"><span class="field-label">Contents</span><textarea name="content" required>${escapeHtml(item?.content || '')}</textarea></label>`;
        } else if (type === 'server') {
            dialogTitle.textContent = isNew ? 'Create sample server' : 'Edit sample server';
            dialogFields.innerHTML = `${field('Server name', 'name', item?.name || '')}${field('Owner', 'owner', item?.owner || 'avery.client')}${field('Node', 'node', item?.node || 'eu-node-01')}${field('Memory', 'memory', item?.memory || '4 GB')}<label class="field-group"><span class="field-label">Status</span><select name="status"><option ${item?.status === 'Online' ? 'selected' : ''}>Online</option><option ${item?.status === 'Offline' ? 'selected' : ''}>Offline</option><option ${item?.status === 'Installing' ? 'selected' : ''}>Installing</option></select></label>`;
        } else if (type === 'user') {
            dialogTitle.textContent = isNew ? 'Create sample user' : 'Edit sample user';
            dialogFields.innerHTML = `${field('Username', 'username', item?.username || '')}${field('Email', 'email', item?.email || '', 'email')}<label class="field-group"><span class="field-label">Role</span><select name="role"><option ${item?.role === 'Client' ? 'selected' : ''}>Client</option><option ${item?.role === 'Administrator' ? 'selected' : ''}>Administrator</option></select></label>`;
        } else {
            const definition = resourcePages[editForm.dataset.collection];
            dialogTitle.textContent = isNew ? `Create ${definition.title.toLowerCase()} record` : `Edit ${definition.title.toLowerCase()} record`;
            dialogFields.innerHTML = definition.fields.map(([key, label]) => field(label, key, item?.[key] || '')).join('');
        }
        editDialog.showModal();
        dialogFields.querySelector('input')?.focus();
    };

    const saveEditor = (formData) => {
        const type = editForm.dataset.type;
        const id = editForm.dataset.id;
        if (type === 'file') {
            const file = { id: id || makeId('file'), name: String(formData.get('name')).trim(), content: String(formData.get('content')) };
            if (!file.name || file.name.includes('/') || file.name.includes('\\')) return showToast('Use a file name without folder paths.');
            const index = state.files.findIndex((item) => item.id === id);
            if (index < 0) state.files.push(file); else state.files[index] = file;
        } else if (type === 'server') {
            const server = { id: id || makeId('server'), name: String(formData.get('name')).trim(), owner: String(formData.get('owner')).trim(), node: String(formData.get('node')).trim(), memory: String(formData.get('memory')).trim(), status: String(formData.get('status')) };
            if (!server.name || !server.owner || !server.node) return showToast('Fill in the server name, owner, and node.');
            const index = state.servers.findIndex((item) => item.id === id);
            if (index < 0) state.servers.push(server); else state.servers[index] = server;
            if (server.id === state.server.id) state.server = { ...state.server, name: server.name, owner: server.owner, status: server.status, memory: server.memory };
        } else if (type === 'user') {
            const user = { id: id || makeId('user'), username: String(formData.get('username')).trim(), email: String(formData.get('email')).trim(), role: String(formData.get('role')) };
            if (!user.username || !user.email) return showToast('Fill in the username and email.');
            const index = state.users.findIndex((item) => item.id === id);
            if (index < 0) state.users.push(user); else state.users[index] = user;
        } else {
            const page = editForm.dataset.collection;
            const definition = resourcePages[page];
            const items = resolveCollection(definition.collection);
            const record = { id: id || makeId(definition.collection.replace('.', '-')) };
            definition.fields.forEach(([key]) => { record[key] = String(formData.get(key)).trim(); });
            if (page === 'client-databases' && !id) Object.assign(record, { username: 'u_demo', host: 'db-01.example.test' });
            if (page === 'client-backups' && !id) Object.assign(record, { size: 'New backup', created: 'Just now', locked: 'No' });
            if (page === 'client-subusers') record.username = record.email.split('@')[0];
            if (page === 'client-network' && !id) Object.assign(record, { ip: '203.0.113.24', port: '25566', primary: items.length ? 'No' : 'Yes' });
            if (page === 'client-account-api' && !id) record.created = 'Just now';
            if (page === 'client-ssh' && !id) record.fingerprint = 'SHA256:demo-key';
            if (page === 'admin-api' && !id) record.user = session.label;
            if (definition.fields.some(([key]) => !record[key])) return showToast('Fill in the required fields.');
            const index = items.findIndex((item) => item.id === id);
            if (index < 0) items.push(record); else items[index] = { ...items[index], ...record };
        }
        editDialog.close();
        render();
        showToast('Saved in this demo session only.');
    };

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = loginEmail.value.trim().toLowerCase();
        const account = accounts[email];
        if (!account || account.password !== loginPassword.value) {
            loginError.hidden = false;
            return;
        }
        startSession(account);
    });

    document.querySelectorAll('[data-fill-login]').forEach((button) => button.addEventListener('click', () => {
        const account = Object.entries(accounts).find(([, value]) => value.role === button.dataset.fillLogin);
        if (!account) return;
        loginEmail.value = account[0];
        loginPassword.value = account[1].password;
        loginError.hidden = true;
        loginEmail.focus();
    }));

    document.getElementById('logout-button').addEventListener('click', signOut);
    document.getElementById('close-dialog').addEventListener('click', () => editDialog.close());
    document.getElementById('cancel-dialog').addEventListener('click', () => editDialog.close());
    editForm.addEventListener('submit', (event) => {
        event.preventDefault();
        saveEditor(new FormData(editForm));
    });

    document.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (!target || !session) return;
        if (target.dataset.toast) return showToast(target.dataset.toast);
        if (target.dataset.openServer) {
            selectedServer = true;
            activePage = 'server-console';
            render();
            return;
        }
        if (target.dataset.page) {
            if (target.dataset.page === 'back-home') {
                selectedServer = false;
                activePage = 'overview';
                render();
                return;
            }
            activePage = target.dataset.page;
            render();
            return;
        }
        const action = target.dataset.action;
        if (action === 'new-file') return openEditor('file');
        if (action === 'edit-file') return openEditor('file', state.files.find((item) => item.id === target.dataset.id));
        if (action === 'delete-file') {
            state.files = state.files.filter((item) => item.id !== target.dataset.id);
            render();
            return showToast('Sample file removed for this session.');
        }
        if (action === 'new-server') return openEditor('server');
        if (action === 'edit-server') return openEditor('server', state.servers.find((item) => item.id === target.dataset.id));
        if (action === 'delete-server') {
            state.servers = state.servers.filter((item) => item.id !== target.dataset.id);
            render();
            return showToast('Sample server removed for this session.');
        }
        if (action === 'new-user') return openEditor('user');
        if (action === 'edit-user') return openEditor('user', state.users.find((item) => item.id === target.dataset.id));
        if (action === 'delete-user') {
            state.users = state.users.filter((item) => item.id !== target.dataset.id);
            render();
            return showToast('Sample user removed for this session.');
        }
        if (action === 'new-record') {
            editForm.dataset.collection = target.dataset.collection;
            return openEditor('record');
        }
        if (action === 'edit-record') {
            editForm.dataset.collection = target.dataset.collection;
            const definition = resourcePages[target.dataset.collection];
            return openEditor('record', resolveCollection(definition.collection).find((item) => item.id === target.dataset.id));
        }
        if (action === 'delete-record') {
            const definition = resourcePages[target.dataset.collection];
            const items = resolveCollection(definition.collection);
            const index = items.findIndex((item) => item.id === target.dataset.id);
            if (index >= 0) items.splice(index, 1);
            render();
            return showToast('Sample record removed for this session.');
        }
        if (action === 'restore-backup') return showToast('Restore simulated. No server files were changed.');
        if (action === 'toggle-backup-lock') {
            const backup = state.client.backups.find((item) => item.id === target.dataset.id);
            if (backup) backup.locked = backup.locked === 'Yes' ? 'No' : 'Yes';
            render();
            return showToast('Backup lock updated for this session.');
        }
        if (action === 'rotate-database') return showToast('Database password rotation simulated. No credentials changed.');
        if (action === 'run-schedule') return showToast('Schedule run simulated. No server task was executed.');
        if (action === 'set-primary') {
            state.client.allocations.forEach((allocation) => { allocation.primary = allocation.id === target.dataset.id ? 'Yes' : 'No'; });
            render();
            return showToast('Primary allocation updated for this session.');
        }
        if (action === 'edit-current-server') return openEditor('server', state.server);
        if (action === 'reinstall-server') return showToast('Reinstall simulated. The sample server was not changed.');
        if (target.dataset.serverAction) {
            const actionName = target.dataset.serverAction;
            state.server.status = actionName === 'stop' ? 'Offline' : 'Online';
            const record = state.servers.find((item) => item.id === state.server.id);
            if (record) record.status = state.server.status;
            render();
            return showToast(actionName === 'restart' ? 'Restart simulated. Sample server is online.' : `Sample server is now ${state.server.status.toLowerCase()}.`);
        }
    });

    document.addEventListener('submit', (event) => {
        if (event.target.id !== 'console-form') return;
        event.preventDefault();
        const input = document.getElementById('console-input');
        const command = input.value.trim();
        if (!command) return;
        state.console.push(`[demo] > ${command}`);
        state.console.push(command.toLowerCase() === 'help'
            ? '[demo] Available sample commands: help, list, say <message>'
            : '[demo] Command received. No server command was executed.');
        render();
        document.getElementById('console-output').scrollTop = document.getElementById('console-output').scrollHeight;
    });
})();