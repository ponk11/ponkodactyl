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
