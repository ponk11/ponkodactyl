import React, { useEffect, useMemo, useState } from 'react';
import { Server } from '@/api/server/getServer';
import getServers from '@/api/getServers';
import ServerRow from '@/components/dashboard/ServerRow';
import Spinner from '@/components/elements/Spinner';
import PageContentBlock from '@/components/elements/PageContentBlock';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { usePersistedState } from '@/plugins/usePersistedState';
import Switch from '@/components/elements/Switch';
import tw from 'twin.macro';
import useSWR from 'swr';
import { PaginatedResult } from '@/api/http';
import Pagination from '@/components/elements/Pagination';
import { useLocation } from 'react-router-dom';
import { summarizeServerHealth } from '@/lib/helpers';

export default () => {
    const { search } = useLocation();
    const defaultPage = Number(new URLSearchParams(search).get('page') || '1');

    const [page, setPage] = useState(!isNaN(defaultPage) && defaultPage > 0 ? defaultPage : 1);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const uuid = useStoreState((state) => state.user.data!.uuid);
    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const [showOnlyAdmin, setShowOnlyAdmin] = usePersistedState(`${uuid}:show_all_servers`, false);
    const [mood, setMood] = useState('Suspiciously operational');
    const [buttonAudits, setButtonAudits] = useState(0);
    const [copyStatus, setCopyStatus] = useState('Copy panel link');
    const [serverFilter, setServerFilter] = useState('');
    const [focusMode, setFocusMode] = usePersistedState<'all' | 'online' | 'attention'>(
        `${uuid}:dashboard_focus`,
        'all'
    );
    const [refreshStatus, setRefreshStatus] = useState('Refresh servers');
    const [compactServers, setCompactServers] = usePersistedState(`${uuid}:compact_servers`, false);

    const {
        data: servers,
        error,
        mutate,
        isValidating,
    } = useSWR<PaginatedResult<Server>>(['/api/client/servers', showOnlyAdmin && rootAdmin, page], () =>
        getServers({ page, type: showOnlyAdmin && rootAdmin ? 'admin' : undefined })
    );

    const serverHealth = useMemo(() => summarizeServerHealth(servers?.items ?? []), [servers?.items]);

    useEffect(() => {
        setPage(1);
    }, [showOnlyAdmin]);

    useEffect(() => {
        if (!servers) return;
        if (servers.pagination.currentPage > 1 && !servers.items.length) {
            setPage(1);
        }
    }, [servers?.pagination.currentPage]);

    useEffect(() => {
        // Don't use react-router to handle changing this part of the URL, otherwise it
        // triggers a needless re-render. We just want to track this in the URL incase the
        // user refreshes the page.
        window.history.replaceState(null, document.title, `/${page <= 1 ? '' : `?page=${page}`}`);
    }, [page]);

    useEffect(() => {
        if (error) clearAndAddHttpError({ key: 'dashboard', error });
        if (!error) clearFlashes('dashboard');
    }, [error]);

    const recalculateVibes = () => {
        const moods = [
            'Suspiciously operational',
            'Powered by green noises',
            'Probably not haunted',
            'Crunchy but stable',
        ];
        setMood(moods[Math.floor(Math.random() * moods.length)]);
        document.body.classList.toggle('ponk-chaos');
    };

    const copyPanelLink = () => {
        navigator.clipboard?.writeText(window.location.href).then(() => {
            setCopyStatus('Copied. Extremely useful.');
            window.setTimeout(() => setCopyStatus('Copy panel link'), 1800);
        });
    };

    const refreshServers = () => {
        setRefreshStatus('Refreshing...');
        mutate().finally(() => {
            setRefreshStatus('Refreshed just now');
            window.setTimeout(() => setRefreshStatus('Refresh servers'), 1800);
        });
    };

    const quickStats = [
        { label: 'Servers', value: serverHealth.total, accent: 'text-green-300' },
        { label: 'Healthy', value: serverHealth.online, accent: 'text-emerald-300' },
        { label: 'Needs attention', value: serverHealth.attention, accent: 'text-yellow-300' },
        {
            label: 'Installing/suspended',
            value: serverHealth.installing + serverHealth.suspended,
            accent: 'text-cyan-300',
        },
    ];

    const matchesFocusMode = (server: Server) => {
        const serverStatus = server.status;
        const needsAttention =
            Boolean(serverStatus) ||
            server.isNodeUnderMaintenance ||
            server.isTransferring ||
            serverStatus === 'installing' ||
            serverStatus === 'suspended' ||
            serverStatus === 'install_failed' ||
            serverStatus === 'reinstall_failed' ||
            serverStatus === 'restoring_backup';

        switch (focusMode) {
            case 'online':
                return !needsAttention;
            case 'attention':
                return needsAttention;
            default:
                return true;
        }
    };

    return (
        <PageContentBlock title={'Dashboard'} showFlashKey={'dashboard'}>
            <section
                className={'ponk-dashboard-widget'}
                css={tw`mb-6 p-5 border border-green-400 border-opacity-40 bg-black bg-opacity-30 shadow-lg`}
            >
                <div css={tw`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4`}>
                    <div>
                        <p css={tw`text-green-300 text-xs uppercase tracking-widest`}>
                            Ponk control center // no warranty
                        </p>
                        <h2 css={tw`text-2xl text-neutral-100 mt-1`}>Everything is {mood.toLowerCase()}.</h2>
                        <p css={tw`text-sm text-neutral-400 mt-2`}>
                            {servers?.items.length || 0} server(s) detected. {buttonAudits} button audits completed.
                            Nothing was repaired.
                        </p>
                    </div>
                    <div css={tw`flex flex-wrap gap-3 lg:justify-end`}>
                        <button
                            type={'button'}
                            onClick={refreshServers}
                            disabled={isValidating}
                            css={tw`px-3 py-2 text-xs uppercase tracking-widest text-cyan-100 bg-cyan-900 bg-opacity-50 border border-cyan-300 border-opacity-50 disabled:opacity-50`}
                        >
                            {refreshStatus}
                        </button>
                        <button
                            type={'button'}
                            onClick={recalculateVibes}
                            css={tw`px-3 py-2 text-xs uppercase tracking-widest text-green-100 bg-green-900 bg-opacity-70 border border-green-400 border-opacity-50`}
                        >
                            Recalculate vibes
                        </button>
                        <button
                            type={'button'}
                            onClick={() => setButtonAudits((count) => count + 1)}
                            css={tw`px-3 py-2 text-xs uppercase tracking-widest text-yellow-100 bg-yellow-900 bg-opacity-40 border border-yellow-300 border-opacity-50`}
                        >
                            Audit a button
                        </button>
                        <button
                            type={'button'}
                            onClick={copyPanelLink}
                            css={tw`px-3 py-2 text-xs uppercase tracking-widest text-neutral-100 bg-neutral-800 border border-neutral-500`}
                        >
                            {copyStatus}
                        </button>
                    </div>
                </div>
            </section>
            <div css={tw`mb-4 grid gap-3 md:grid-cols-4`}>
                {quickStats.map((stat) => (
                    <div
                        key={stat.label}
                        css={tw`rounded border border-green-300 border-opacity-30 bg-black bg-opacity-20 p-3`}
                    >
                        <p css={tw`text-[10px] uppercase tracking-[0.24em] text-neutral-400`}>{stat.label}</p>
                        <p css={tw`mt-2 text-2xl font-semibold ${stat.accent}`}>{stat.value}</p>
                    </div>
                ))}
            </div>
            <div css={tw`mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between`}>
                <div css={tw`flex flex-wrap gap-2`}>
                    {(['all', 'online', 'attention'] as const).map((mode) => (
                        <button
                            key={mode}
                            type={'button'}
                            onClick={() => setFocusMode(mode)}
                            css={tw`px-3 py-2 text-[10px] uppercase tracking-[0.24em] border ${
                                focusMode === mode
                                    ? 'border-green-400 bg-green-900 bg-opacity-60 text-green-100'
                                    : 'border-neutral-600 bg-neutral-900 bg-opacity-40 text-neutral-300'
                            }`}
                        >
                            {mode === 'all' ? 'all servers' : mode === 'online' ? 'online only' : 'needs attention'}
                        </button>
                    ))}
                </div>
                <div css={tw`flex flex-col sm:flex-row gap-3 sm:items-center`}>
                    <label css={tw`flex-1`}>
                        <span css={tw`sr-only`}>Filter servers</span>
                        <input
                            type={'search'}
                            value={serverFilter}
                            onChange={(event) => setServerFilter(event.target.value)}
                            placeholder={'Filter servers by name or description...'}
                            css={tw`w-full bg-black bg-opacity-30 border-neutral-600 text-neutral-100 placeholder-neutral-500`}
                        />
                    </label>
                    <label
                        css={tw`flex items-center text-xs uppercase tracking-widest text-neutral-400 cursor-pointer`}
                    >
                        <input
                            type={'checkbox'}
                            checked={compactServers}
                            onChange={(event) => setCompactServers(event.target.checked)}
                            css={tw`mr-2`}
                        />
                        Compact list
                    </label>
                </div>
            </div>
            {rootAdmin && (
                <div css={tw`mb-2 flex justify-end items-center`}>
                    <p css={tw`uppercase text-xs text-neutral-400 mr-2`}>
                        {showOnlyAdmin ? "Showing others' servers" : 'Showing your servers'}
                    </p>
                    <Switch
                        name={'show_all_servers'}
                        defaultChecked={showOnlyAdmin}
                        onChange={() => setShowOnlyAdmin((s) => !s)}
                    />
                </div>
            )}
            {!servers ? (
                <Spinner centered size={'large'} />
            ) : (
                <Pagination data={servers} onPageSelect={setPage}>
                    {({ items }) => {
                        const query = serverFilter.trim().toLowerCase();
                        const visibleItems = items.filter((server) => {
                            const matchesQuery = `${server.name} ${server.description || ''}`
                                .toLowerCase()
                                .includes(query);

                            return matchesQuery && matchesFocusMode(server);
                        });

                        return visibleItems.length > 0 ? (
                            visibleItems.map((server, index) => (
                                <ServerRow
                                    key={server.uuid}
                                    server={server}
                                    css={index > 0 ? (compactServers ? tw`mt-1` : tw`mt-2`) : undefined}
                                />
                            ))
                        ) : (
                            <p css={tw`text-center text-sm text-neutral-400`}>
                                {query
                                    ? 'No servers matched that filter. The servers may be hiding.'
                                    : focusMode === 'online'
                                    ? 'No healthy servers are visible right now. The weirdness is strong.'
                                    : focusMode === 'attention'
                                    ? 'Nothing currently needs attention. Everything is suspiciously calm.'
                                    : showOnlyAdmin
                                    ? 'There are no other servers to display.'
                                    : 'There are no servers associated with your account.'}
                            </p>
                        );
                    }}
                </Pagination>
            )}
        </PageContentBlock>
    );
};
