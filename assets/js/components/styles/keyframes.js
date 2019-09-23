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
    top: ${start};
  }

  100% {
    top: ${end};
  }
`;

export {
  slideX,
  slideY,
};
