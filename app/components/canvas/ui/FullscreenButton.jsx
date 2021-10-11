import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { Button } from '/app/components/styles/atoms';

const StyledButton = styled(Button)`
  left: 1rem;
  position: absolute;
  top: 1rem;
  z-index: 2;
`;

function FullscreenButton(props) {
  const containerID = useSelector(state => state.ui.canvasContainerID);
  const openFullscreen = () => {
    const container = document.getElementById(containerID);
    container.requestFullscreen();
  };

  const exitFullscreen = () => {
    document.exitFullscreen();
  };

  const toggleFullscreen = () => {
    const fullscreenEl = document.fullscreenElement;

    if (fullscreenEl) {
      exitFullscreen();
    } else {
      openFullscreen();
    }
  };

  return (
    <StyledButton
      onClick={toggleFullscreen}
    >
      {props.isFullscreen ? 'Exit' : 'Edit'}
    </StyledButton>
  );
}

export default FullscreenButton;
