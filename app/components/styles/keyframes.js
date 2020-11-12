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

const fadeAway = keyframes`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`;

const movingStripes = max => keyframes`
  0% {
    background-position: 0px;
  }

  100% {
    background-position: ${max};
  }
`;

export {
  slideX,
  slideY,
  reveal,
  fadeAway,
  movingStripes,
};
