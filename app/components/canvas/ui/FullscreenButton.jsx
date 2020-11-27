import React from 'react';
import styled from 'styled-components';

import { Button } from '/app/components/styles/atoms';

const StyledButton = styled(Button)`
  left: 1rem;
  position: absolute;
  top: 1rem;
  z-index: 2;
`;

function FullscreenButton(props) {
  return (
    <StyledButton
      onClick={() => props.toggleFullscreen()}
    >
      {props.isFullscreen ? 'Exit' : 'Edit'}
    </StyledButton>
  );
}

export default FullscreenButton;
