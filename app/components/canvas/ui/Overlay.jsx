import React from 'react';
import styled from 'styled-components';

import ScreenLockButton from './ScreenLockButton';

const FlipbookNav = styled.nav`
  display: flex;
  flex-direction: column;
  height: 13rem;
  justify-content: space-between;
  left: 1rem;
  position: absolute;
  z-index: 2;
`;

function Overlay(props) {
  const { 
    isFullscreen,
    isLocked,
    next,
    prev,
    toggleLock,
  } = props.options;

  return (
    <>
      <FlipbookNav>
        { next }
        { prev }
      </FlipbookNav>
      <ScreenLockButton
        isFullscreen={isFullscreen}
        isLocked={isLocked}
        toggleLock={toggleLock}
      />
    </>
  );
}

export default Overlay;
