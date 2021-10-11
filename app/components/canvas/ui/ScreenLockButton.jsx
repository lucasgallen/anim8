import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

function ScreenLockButton() {
  const dispatch = useDispatch();
  const {
    isFullscreen,
    isLocked,
  } = useSelector(state => ({
    isFullscreen: state.ui.fullscreen,
    isLocked: state.ui.isLocked,
  }));

  const toggleLock = () => {
    dispatch(setIsLocked(!isLocked));
    dispatch(setDrawDisabled(isLocked));
  };

  return (
    <StyledButton
      isFullscreen={isFullscreen}
      onClick={toggleLock}
    >
      {isLocked ? 'unlock' : 'lock'}
    </StyledButton>
  );
}

export default ScreenLockButton;
