import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { setIsLocked, setDrawDisabled } from '/app/actions/canvas';

import { Button } from '/app/components/styles/atoms';

const StyledButton = styled(Button)`
  display: ${props => props.isFullscreen ? 'block' : 'none'};
  bottom: 1rem;
  position: absolute;
  right: 1rem;
  z-index: 3;
`;

function ScreenLockButton(props) {
  const toggleLock = () => {
    props.setIsLocked(!props.isLocked);
    props.setDrawDisabled(props.isLocked);
  };

  return (
    <StyledButton
      isFullscreen={props.isFullscreen}
      onClick={toggleLock}
    >
      {props.isLocked ? 'unlock' : 'lock'}
    </StyledButton>
  );
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setDrawDisabled,
      setIsLocked,
    },
    dispatch
  );
};

const mapStateToProps = state => (
  {
    isFullscreen: state.ui.fullscreen,
    isLocked: state.ui.isLocked,
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(ScreenLockButton);
