import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  display: ${props => props.isFullscreen ? 'block' : 'none'};
  bottom: 1rem;
  position: absolute;
  right: 1rem;
  z-index: 3;
`;

function ScreenLockButton(props) {
  return (
    <Button
      isFullscreen={props.isFullscreen}
      onClick={() => props.toggleLock()}
    >
      {props.isLocked ? 'unlock' : 'lock'}
    </Button>
  );
}

export default ScreenLockButton;
