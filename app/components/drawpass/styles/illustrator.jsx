import styled from 'styled-components';

import { Button } from '../../styles/atoms';
import { movingStripes, fadeAway } from '../../styles/keyframes';

const SaveContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SaveResponse = styled.span`
  animation-name: ${props => props.trigger ? fadeAway : ''};
  animation-delay: 3s;
  animation-duration: 3s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  color: ${props => props.error ? 'red' : 'green'};
  font-size: 2rem;
  font-weight: bold;
  margin-left: 1rem;
`;

const SaveButton = styled(Button)`
  ${props => {
    if (!props.isSaving) return;
    return `
      background: repeating-linear-gradient(
        45deg,
        #7fffd485,
        #7fffd485 1rem,
        #5f9ea08c 1rem,
        #5f9ea08c 2rem
      );
      pointer-events: none;
    `;
  }}
  background-size: 28rem;
  animation-name: ${movingStripes('-13.4rem')};
  animation-duration: 3s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  min-width: ${props => props.isSaving ? '14rem' : '11rem'};
  transition: min-width 0.2s ease-in-out;
`;

export {
  SaveButton,
  SaveContainer,
  SaveResponse,
};
