import { keyframes } from 'styled-components';

const slideX = (start, end) => keyframes`
  from {
    transform: translate(${end}, 0);
  }

  to {
    transform: translate(${start}, 0);
  }
`;

const slideY = (start, end) => keyframes`
  0% {
    transform: translate(0, ${start});
  }

  100% {
    transform: translate(0, ${end});
  }
`;

const reveal = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

export {
  slideX,
  slideY,
  reveal,
};
