import React from 'react';
import styled from 'styled-components';

import { Button } from '/app/components/styles/atoms';

const StyledButton = styled(Button)`
  display: ${props => props.isFullscreen ? 'block' : 'none'};
  bottom: 1rem;
  position: absolute;
  right: 1rem;
  z-index: 3;
`;

function ScreenLockButton(props) {
  return (
    <StyledButton
      isFullscreen={props.isFullscreen}
      onClick={() => props.toggleLock()}
    >
      {props.isLocked ? 'unlock' : 'lock'}
    </StyledButton>
  );
}

export default ScreenLockButton;
