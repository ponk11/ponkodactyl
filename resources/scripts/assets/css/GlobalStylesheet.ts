import tw from 'twin.macro';
import { createGlobalStyle } from 'styled-components/macro';
// @ts-expect-error untyped font file
import font from '@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2';

export default createGlobalStyle`
    @font-face {
        font-family: 'IBM Plex Sans';
        font-style: normal;
        font-display: swap;
        font-weight: 100 700;
        src: url(${font}) format('woff2-variations');
        unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
    }

    body {
        ${tw`font-sans text-neutral-200`};
        min-height: 100vh;
        background:
            radial-gradient(circle at 16% 16%, rgb(148 255 196 / 0.3), transparent 26rem),
            radial-gradient(circle at 80% 82%, rgb(90 255 162 / 0.14), transparent 20rem),
            radial-gradient(circle at 50% 50%, rgb(6 30 20 / 0.94), rgb(4 18 12 / 1) 40%, rgb(2 9 7 / 1) 100%);
        background-attachment: fixed;
        letter-spacing: 0.015em;
    }

    body::before {
        content: '';
        position: fixed;
        inset: 0;
        pointer-events: none;
        opacity: 0.38;
        background:
            linear-gradient(135deg, transparent 0 46%, rgb(125 255 181 / 0.1) 47%, transparent 48%),
            repeating-linear-gradient(0deg, rgb(120 255 185 / 0.06), rgb(120 255 185 / 0.06) 1px, transparent 1px, transparent 7px),
            radial-gradient(circle at center, transparent 52%, rgb(0 0 0 / 0.28) 100%);
        background-size: 100% 100%, 100% 100%, 100% 100%;
        mix-blend-mode: screen;
        z-index: -1;
    }

    body::after {
        content: '';
        position: fixed;
        inset: 0;
        pointer-events: none;
        background: radial-gradient(circle at center, transparent 0%, rgb(0 0 0 / 0.22) 72%, rgb(0 0 0 / 0.5) 100%);
        z-index: -1;
    }

    .ponk-server-console {
        max-width: 1320px;
        margin: 0 auto;
        padding-bottom: 28px;
    }

    .ponk-server-hero {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(240px, 300px);
        align-items: center;
        gap: 24px;
        padding: 22px;
        background:
            linear-gradient(115deg, rgb(12 39 24 / 0.94), rgb(7 19 13 / 0.94) 68%),
            repeating-linear-gradient(90deg, transparent 0 38px, rgb(131 232 120 / 0.035) 39px 40px);
        border: 1px solid #28583a;
        border-left: 3px solid #83e878;
        border-radius: 4px;
        box-shadow: 0 14px 34px rgb(0 0 0 / 0.16);
    }

    .ponk-server-kicker {
        margin: 0 0 7px;
        color: #69d79b;
        font-size: 10px;
        font-weight: 700;
    }

    .ponk-server-identity h1 {
        margin: 0;
        color: #f0f8f1;
        font-size: 27px;
        font-weight: 600;
        line-height: 1.2;
        overflow-wrap: anywhere;
    }

    .ponk-server-description {
        margin: 8px 0 0;
        color: #a6bcae;
        font-size: 13px;
    }

    .ponk-server-indicators {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-top: 15px;
    }

    .ponk-server-state,
    .ponk-server-socket {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        min-height: 26px;
        padding: 4px 9px;
        color: #b7c9bc;
        background: #102219;
        border: 1px solid #2b5137;
        border-radius: 3px;
        font-size: 10px;
        text-transform: uppercase;
    }

    .ponk-server-state::before,
    .ponk-server-socket::before {
        width: 7px;
        height: 7px;
        flex: 0 0 7px;
        content: '';
        border-radius: 50%;
        background: #d76b63;
    }

    .ponk-server-state[data-state='running']::before,
    .ponk-server-socket[data-connected='true']::before {
        background: #83e878;
        box-shadow: 0 0 9px rgb(131 232 120 / 0.65);
    }

    .ponk-server-state[data-state='starting']::before,
    .ponk-server-state[data-state='stopping']::before,
    .ponk-server-state[data-state='installing']::before,
    .ponk-server-state[data-state='restoring_backup']::before,
    .ponk-server-state[data-state='transferring']::before {
        background: #e9b44b;
        box-shadow: 0 0 9px rgb(233 180 75 / 0.55);
    }

    .ponk-server-power {
        display: flex;
        flex-direction: column;
        gap: 9px;
        padding-left: 18px;
        border-left: 1px solid #2b5137;
    }

    .ponk-server-power .ponk-server-kicker {
        margin: 0;
    }

    .ponk-server-power button {
        min-height: 38px;
        transform: none !important;
    }

    .ponk-server-shortcuts {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 14px 0 20px;
    }

    .ponk-server-shortcuts a,
    .ponk-server-shortcuts__node {
        display: inline-flex;
        min-height: 38px;
        align-items: center;
        gap: 9px;
        padding: 0 13px;
        color: #b8cbbd;
        background: rgb(10 27 19 / 0.78);
        border: 1px solid #244a33;
        border-radius: 3px;
        font-size: 12px;
        text-decoration: none;
        transition: color 130ms ease, border-color 130ms ease, background-color 130ms ease;
    }

    .ponk-server-shortcuts a:hover {
        color: #d9ffbe;
        background: #11281a;
        border-color: #68bd71;
    }

    .ponk-server-shortcuts svg {
        color: #83e878;
    }

    .ponk-server-shortcuts__node {
        margin-left: auto;
        color: #8faa98;
        border-color: transparent;
        background: transparent;
    }

    .ponk-server-console-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.8fr) minmax(290px, 0.8fr);
        gap: 14px;
        align-items: start;
    }

    .ponk-server-console-panel,
    .ponk-server-telemetry,
    .ponk-server-graphs {
        min-width: 0;
        padding: 15px;
        background: rgb(8 22 15 / 0.76);
        border: 1px solid #1f432d;
        border-radius: 4px;
    }

    .ponk-server-panel-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
    }

    .ponk-server-panel-heading .ponk-server-kicker {
        margin-bottom: 3px;
    }

    .ponk-server-panel-heading h2 {
        margin: 0;
        color: #e4f0e7;
        font-size: 16px;
        font-weight: 600;
    }

    .ponk-server-panel-heading .ponk-server-socket {
        min-height: 23px;
        font-size: 9px;
    }

    .ponk-server-console-panel .terminal {
        min-height: 360px;
    }

    .ponk-server-console-panel .terminal > .container {
        min-height: 350px;
        background: #050b08;
        border: 1px solid #1b3825;
        border-radius: 3px 3px 0 0;
    }

    .ponk-server-console-panel .command_input {
        color: #d9f5dd;
        background: #0b1710;
        border-bottom-color: #28583a;
    }

    .ponk-server-metrics {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
    }

    .ponk-server-metrics > div {
        grid-column: auto / span 1;
        min-width: 0;
        padding: 9px;
        background: #102019;
        border: 1px solid #22452f;
        border-radius: 3px;
        box-shadow: none;
    }

    .ponk-server-metrics .icon {
        width: 30px;
        height: 30px;
        margin-right: 8px;
        box-shadow: none;
    }

    .ponk-server-graphs {
        margin-top: 14px;
    }

    .ponk-server-graphs > .ponk-server-panel-heading {
        margin-bottom: 14px;
    }

    .ponk-server-graphs > div:not(.ponk-server-panel-heading) {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
    }

    .ponk-server-graphs .chart_container {
        min-width: 0;
        background: #102019;
        border-bottom-color: #43824d;
        box-shadow: none;
    }

    @media (max-width: 1000px) {
        .ponk-server-console-grid {
            grid-template-columns: minmax(0, 1fr);
        }

        .ponk-server-metrics {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }
    }

    @media (max-width: 700px) {
        .ponk-server-hero {
            grid-template-columns: minmax(0, 1fr);
            gap: 17px;
            padding: 16px;
        }

        .ponk-server-identity h1 {
            font-size: 23px;
        }

        .ponk-server-power {
            padding: 12px 0 0;
            border-top: 1px solid #2b5137;
            border-left: 0;
        }

        .ponk-server-power .flex {
            width: 100%;
        }

        .ponk-server-shortcuts__node {
            display: none;
        }

        .ponk-server-console-panel,
        .ponk-server-telemetry,
        .ponk-server-graphs {
            padding: 10px;
        }

        .ponk-server-console-panel .terminal {
            min-height: 280px;
        }

        .ponk-server-console-panel .terminal > .container {
            min-height: 275px;
        }

        .ponk-server-metrics {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .ponk-server-graphs > div:not(.ponk-server-panel-heading) {
            grid-template-columns: minmax(0, 1fr);
        }
    }

    .ponk-server-console {
        max-width: 1320px;
        margin: 0 auto;
        padding-bottom: 28px;
    }

    .ponk-server-hero {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(240px, 300px);
        align-items: center;
        gap: 24px;
        padding: 22px;
        background:
            linear-gradient(115deg, rgb(12 39 24 / 0.94), rgb(7 19 13 / 0.94) 68%),
            repeating-linear-gradient(90deg, transparent 0 38px, rgb(131 232 120 / 0.035) 39px 40px);
        border: 1px solid #28583a;
        border-left: 3px solid #83e878;
        border-radius: 4px;
        box-shadow: 0 14px 34px rgb(0 0 0 / 0.16);
    }

    .ponk-server-kicker {
        margin: 0 0 7px;
        color: #69d79b;
        font-size: 10px;
        font-weight: 700;
    }

    .ponk-server-identity h1 {
        margin: 0;
        color: #f0f8f1;
        font-size: 27px;
        font-weight: 600;
        line-height: 1.2;
        overflow-wrap: anywhere;
    }

    .ponk-server-description {
        margin: 8px 0 0;
        color: #a6bcae;
        font-size: 13px;
    }

    .ponk-server-indicators {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-top: 15px;
    }

    .ponk-server-state,
    .ponk-server-socket {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        min-height: 26px;
        padding: 4px 9px;
        color: #b7c9bc;
        background: #102219;
        border: 1px solid #2b5137;
        border-radius: 3px;
        font-size: 10px;
        text-transform: uppercase;
    }

    .ponk-server-state::before,
    .ponk-server-socket::before {
        width: 7px;
        height: 7px;
        flex: 0 0 7px;
        content: '';
        border-radius: 50%;
        background: #d76b63;
    }

    .ponk-server-state[data-state='running']::before,
    .ponk-server-socket[data-connected='true']::before {
        background: #83e878;
        box-shadow: 0 0 9px rgb(131 232 120 / 0.65);
    }

    .ponk-server-state[data-state='starting']::before,
    .ponk-server-state[data-state='stopping']::before,
    .ponk-server-state[data-state='installing']::before,
    .ponk-server-state[data-state='restoring_backup']::before,
    .ponk-server-state[data-state='transferring']::before {
        background: #e9b44b;
        box-shadow: 0 0 9px rgb(233 180 75 / 0.55);
    }

    .ponk-server-power {
        display: flex;
        flex-direction: column;
        gap: 9px;
        padding-left: 18px;
        border-left: 1px solid #2b5137;
    }

    .ponk-server-power .ponk-server-kicker {
        margin: 0;
    }

    .ponk-server-power button {
        min-height: 38px;
        transform: none !important;
    }

    .ponk-server-shortcuts {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 14px 0 20px;
    }

    .ponk-server-shortcuts a,
    .ponk-server-shortcuts__node {
        display: inline-flex;
        min-height: 38px;
        align-items: center;
        gap: 9px;
        padding: 0 13px;
        color: #b8cbbd;
        background: rgb(10 27 19 / 0.78);
        border: 1px solid #244a33;
        border-radius: 3px;
        font-size: 12px;
        text-decoration: none;
        transition: color 130ms ease, border-color 130ms ease, background-color 130ms ease;
    }

    .ponk-server-shortcuts a:hover {
        color: #d9ffbe;
        background: #11281a;
        border-color: #68bd71;
    }

    .ponk-server-shortcuts svg {
        color: #83e878;
    }

    .ponk-server-shortcuts__node {
        margin-left: auto;
        color: #8faa98;
        border-color: transparent;
        background: transparent;
    }

    .ponk-server-console-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.8fr) minmax(290px, 0.8fr);
        gap: 14px;
        align-items: start;
    }

    .ponk-server-console-panel,
    .ponk-server-telemetry,
    .ponk-server-graphs {
        min-width: 0;
        padding: 15px;
        background: rgb(8 22 15 / 0.76);
        border: 1px solid #1f432d;
        border-radius: 4px;
    }

    .ponk-server-panel-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
    }

    .ponk-server-panel-heading .ponk-server-kicker {
        margin-bottom: 3px;
    }

    .ponk-server-panel-heading h2 {
        margin: 0;
        color: #e4f0e7;
        font-size: 16px;
        font-weight: 600;
    }

    .ponk-server-panel-heading .ponk-server-socket {
        min-height: 23px;
        font-size: 9px;
    }

    .ponk-server-console-panel > .relative {
        min-height: 360px;
    }

    .ponk-server-console-panel > .relative > .overflows_container {
        width: 100%;
        margin-left: 0;
    }

    .ponk-server-console-panel .command_input {
        color: #d9f5dd;
        background: #0b1710;
        border-bottom-color: #28583a;
    }

    .ponk-server-metrics {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
    }

    .ponk-server-metrics > div {
        grid-column: auto / span 1;
        min-width: 0;
        padding: 9px;
        background: #102019;
        border: 1px solid #22452f;
        border-radius: 3px;
        box-shadow: none;
    }

    .ponk-server-metrics .icon {
        width: 30px;
        height: 30px;
        margin-right: 8px;
        box-shadow: none;
    }

    .ponk-server-graphs {
        margin-top: 14px;
    }

    .ponk-server-graphs > div:not(.ponk-server-panel-heading) {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
    }

    .ponk-server-graphs .chart_container {
        min-width: 0;
        background: #102019;
        border-bottom-color: #43824d;
        box-shadow: none;
    }

    @media (max-width: 1000px) {
        .ponk-server-console-grid {
            grid-template-columns: minmax(0, 1fr);
        }

        .ponk-server-metrics {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }
    }

    @media (max-width: 700px) {
        .ponk-server-hero {
            grid-template-columns: minmax(0, 1fr);
            gap: 17px;
            padding: 16px;
        }

        .ponk-server-identity h1 {
            font-size: 23px;
        }

        .ponk-server-power {
            padding: 12px 0 0;
            border-top: 1px solid #2b5137;
            border-left: 0;
        }

        .ponk-server-power .flex {
            width: 100%;
        }

        .ponk-server-shortcuts__node {
            display: none;
        }

        .ponk-server-console-panel,
        .ponk-server-telemetry,
        .ponk-server-graphs {
            padding: 10px;
        }

        .ponk-server-console-panel > .relative {
            min-height: 280px;
        }

        .ponk-server-metrics {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .ponk-server-graphs > div:not(.ponk-server-panel-heading) {
            grid-template-columns: minmax(0, 1fr);
        }
    }

    body.ponk-chaos #logo {
        transform: rotate(-2deg) skewX(-4deg);
    }

    body.ponk-chaos #logo a {
        color: #b7ff5c;
        text-shadow: 4px 2px 0 #103b2b;
    }

    body.ponk-chaos .ponk-panel {
        filter: hue-rotate(12deg) saturate(1.12);
    }

    body.ponk-ui button {
        border-radius: 3px;
        transition: transform 180ms ease, box-shadow 180ms ease;
    }

    body.ponk-ui button:nth-of-type(odd) {
        transform: translateX(2px) rotate(-0.6deg);
    }

    body.ponk-ui button:nth-of-type(3n) {
        transform: translateY(1px) rotate(0.7deg);
    }

    body.ponk-ui button:hover {
        transform: translate(0, -3px) rotate(1.5deg) scale(1.03);
        box-shadow: 3px 4px 0 rgb(183 255 92 / 0.2);
    }

    body.ponk-chaos button:nth-of-type(2n) {
        transform: translate(5px, -2px) rotate(-2deg);
    }

    h1, h2, h3, h4, h5, h6 {
        ${tw`font-medium tracking-normal font-header`};
    }

    p {
        ${tw`text-neutral-200 leading-snug font-sans`};
    }

    form {
        ${tw`m-0`};
    }

    textarea, select, input, button, button:focus, button:focus-visible {
        ${tw`outline-none`};
    }

    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
    }

    input[type=number] {
        -moz-appearance: textfield !important;
    }

    /* Scroll Bar Style */
    ::-webkit-scrollbar {
        background: none;
        width: 16px;
        height: 16px;
    }

    ::-webkit-scrollbar-thumb {
        border: solid 0 rgb(0 0 0 / 0%);
        border-right-width: 4px;
        border-left-width: 4px;
        -webkit-border-radius: 9px 4px;
        -webkit-box-shadow: inset 0 0 0 1px #70d69d, inset 0 0 0 4px #164b35;
    }

    ::-webkit-scrollbar-track-piece {
        margin: 4px 0;
    }

    ::-webkit-scrollbar-thumb:horizontal {
        border-right-width: 0;
        border-left-width: 0;
        border-top-width: 4px;
        border-bottom-width: 4px;
        -webkit-border-radius: 4px 9px;
    }

    ::-webkit-scrollbar-corner {
        background: transparent;
    }
`;
