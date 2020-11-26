import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  left: 1rem;
  position: absolute;
  top: 1rem;
  z-index: 2;
`;

function FullscreenButton(props) {
  return (
    <Button
      onClick={() => props.toggleFullscreen()}
    >
      {props.isFullscreen ? 'Exit' : 'Edit'}
    </Button>
  );
}

export default FullscreenButton;
