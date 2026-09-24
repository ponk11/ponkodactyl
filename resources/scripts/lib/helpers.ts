/**
 * Given a valid six character HEX color code, converts it into its associated
 * RGBA value with a user controllable alpha channel.
 */
function hexToRgba(hex: string, alpha = 1): string {
    // noinspection RegExpSimplifiable
    if (!/#?([a-fA-F0-9]{2}){3}/.test(hex)) {
        return hex;
    }

    // noinspection RegExpSimplifiable
    const [r, g, b] = hex.match(/[a-fA-F0-9]{2}/g)!.map((v) => parseInt(v, 16));

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export interface ServerHealthSummary {
    total: number;
    online: number;
    attention: number;
    installing: number;
    suspended: number;
}

export function summarizeServerHealth(
    servers: Array<{ status?: string | null; isNodeUnderMaintenance?: boolean; isTransferring?: boolean }>
): ServerHealthSummary {
    const summary: ServerHealthSummary = {
        total: servers.length,
        online: 0,
        attention: 0,
        installing: 0,
        suspended: 0,
    };

    for (const server of servers) {
        const status = server.status;

        if (status === 'installing') {
            summary.installing += 1;
            summary.attention += 1;
            continue;
        }

        if (status === 'suspended') {
            summary.suspended += 1;
            summary.attention += 1;
            continue;
        }

        if (status === 'install_failed' || status === 'reinstall_failed' || status === 'restoring_backup') {
            summary.attention += 1;
            continue;
        }

        if (server.isNodeUnderMaintenance || server.isTransferring) {
            summary.attention += 1;
            continue;
        }

        summary.online += 1;
    }

    return summary;
}

export { hexToRgba };
