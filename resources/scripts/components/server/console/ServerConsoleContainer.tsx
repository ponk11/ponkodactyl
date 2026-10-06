import React, { memo } from 'react';
import { ServerContext } from '@/state/server';
import Can from '@/components/elements/Can';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import isEqual from 'react-fast-compare';
import Spinner from '@/components/elements/Spinner';
import Features from '@feature/Features';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faClock, faFolderOpen, faPlay, faServer } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Console from '@/components/server/console/Console';
import StatGraphs from '@/components/server/console/StatGraphs';
import PowerButtons from '@/components/server/console/PowerButtons';
import ServerDetailsBlock from '@/components/server/console/ServerDetailsBlock';
import { Alert } from '@/components/elements/alert';

export type PowerAction = 'start' | 'stop' | 'restart' | 'kill';

const ServerConsoleContainer = () => {
    const name = ServerContext.useStoreState((state) => state.server.data!.name);
    const description = ServerContext.useStoreState((state) => state.server.data!.description);
    const isInstalling = ServerContext.useStoreState((state) => state.server.isInstalling);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data!.isTransferring);
    const eggFeatures = ServerContext.useStoreState((state) => state.server.data!.eggFeatures, isEqual);
    const isNodeUnderMaintenance = ServerContext.useStoreState((state) => state.server.data!.isNodeUnderMaintenance);
    const serverId = ServerContext.useStoreState((state) => state.server.data!.id);
    const node = ServerContext.useStoreState((state) => state.server.data!.node);
    const status = ServerContext.useStoreState((state) => state.status.value);
    const connected = ServerContext.useStoreState((state) => state.socket.connected);
    const statusLabel = (status || 'offline').replace(/_/g, ' ');

    return (
        <ServerContentBlock title={'Dashboard'}>
            <div className={'ponk-server-console'}>
                {(isNodeUnderMaintenance || isInstalling || isTransferring) && (
                    <Alert type={'warning'} className={'mb-5'}>
                        {isNodeUnderMaintenance
                            ? 'The node of this server is currently under maintenance and all actions are unavailable.'
                            : isInstalling
                            ? 'This server is currently running its installation process and most actions are unavailable.'
                            : 'This server is currently being transferred to another node and all actions are unavailable.'}
                    </Alert>
                )}
                <section className={'ponk-server-hero'}>
                    <div className={'ponk-server-identity'}>
                        <p className={'ponk-server-kicker'}>REMOTE MACHINE // NODE {node}</p>
                        <h1>{name}</h1>
                        {description && <p className={'ponk-server-description'}>{description}</p>}
                        <div className={'ponk-server-indicators'}>
                            <span className={'ponk-server-state'} data-state={status || 'offline'}>
                                {statusLabel}
                            </span>
                            <span className={'ponk-server-socket'} data-connected={connected}>
                                {connected ? 'Wings link live' : 'Wings link searching'}
                            </span>
                        </div>
                    </div>
                    <div className={'ponk-server-power'}>
                        <span className={'ponk-server-kicker'}>POWER CONTROLS</span>
                        <Can action={['control.start', 'control.stop', 'control.restart']} matchAny>
                            <PowerButtons className={'flex space-x-2'} />
                        </Can>
                    </div>
                </section>

                <nav className={'ponk-server-shortcuts'} aria-label={'Server shortcuts'}>
                    <Can action={'file.*'}>
                        <Link to={`/server/${serverId}/files`}>
                            <FontAwesomeIcon icon={faFolderOpen} />
                            <span>Files</span>
                        </Link>
                    </Can>
                    <Can action={'backup.*'}>
                        <Link to={`/server/${serverId}/backups`}>
                            <FontAwesomeIcon icon={faArchive} />
                            <span>Backups</span>
                        </Link>
                    </Can>
                    <Can action={'schedule.*'}>
                        <Link to={`/server/${serverId}/schedules`}>
                            <FontAwesomeIcon icon={faClock} />
                            <span>Schedules</span>
                        </Link>
                    </Can>
                    <Can action={'startup.*'}>
                        <Link to={`/server/${serverId}/startup`}>
                            <FontAwesomeIcon icon={faPlay} />
                            <span>Startup</span>
                        </Link>
                    </Can>
                    <span className={'ponk-server-shortcuts__node'}>
                        <FontAwesomeIcon icon={faServer} />
                        <span>{node}</span>
                    </span>
                </nav>

                <div className={'ponk-server-console-grid'}>
                    <section className={'ponk-server-console-panel'}>
                        <header className={'ponk-server-panel-heading'}>
                            <div>
                                <p className={'ponk-server-kicker'}>LIVE OUTPUT</p>
                                <h2>Console</h2>
                            </div>
                            <span className={'ponk-server-socket'} data-connected={connected}>
                                {connected ? 'CONNECTED' : 'RECONNECTING'}
                            </span>
                        </header>
                        <Spinner.Suspense>
                            <Console />
                        </Spinner.Suspense>
                    </section>
                    <aside className={'ponk-server-telemetry'}>
                        <header className={'ponk-server-panel-heading'}>
                            <div>
                                <p className={'ponk-server-kicker'}>WINGS FEED</p>
                                <h2>Live telemetry</h2>
                            </div>
                        </header>
                        <ServerDetailsBlock className={'ponk-server-metrics'} />
                    </aside>
                </div>

                <section className={'ponk-server-graphs'}>
                    <header className={'ponk-server-panel-heading'}>
                        <div>
                            <p className={'ponk-server-kicker'}>RECENT SIGNAL</p>
                            <h2>Resource history</h2>
                        </div>
                    </header>
                    <div className={'ponk-server-graph-grid'}>
                        <Spinner.Suspense>
                            <StatGraphs />
                        </Spinner.Suspense>
                    </div>
                </section>
                <Features enabled={eggFeatures} />
            </div>
        </ServerContentBlock>
    );
};

export default memo(ServerConsoleContainer, isEqual);
