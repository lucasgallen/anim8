import styled, { keyframes } from 'styled-components';

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

export {
  slideX,
  slideY,
};
