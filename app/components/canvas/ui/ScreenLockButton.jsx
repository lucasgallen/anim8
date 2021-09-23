import React from 'react';
import { connect } from 'react-redux';
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

const mapStateToProps = state => (
  {
    isFullscreen: state.ui.fullscreen,
  }
);

export default connect(mapStateToProps)(ScreenLockButton);
