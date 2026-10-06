import styled from 'styled-components/macro';
import tw from 'twin.macro';

const SubNavigation = styled.div`
    ${tw`w-full shadow overflow-x-auto`};
    background: #09160f;
    border-bottom: 1px solid #1a3a27;

    & > div {
        ${tw`flex items-center text-sm mx-auto px-2`};
        max-width: 1200px;

        & > a,
        & > div {
            ${tw`inline-block py-3 px-4 no-underline whitespace-nowrap transition-all duration-150`};
            color: #a8beb0;

            &:not(:first-of-type) {
                ${tw`ml-2`};
            }

            &:hover {
                color: #e7f8eb;
            }

            &:active,
            &.active {
                color: #b7ff5c;
                box-shadow: inset 0 -2px #83e878;
            }
        }
    }
`;

export default SubNavigation;
