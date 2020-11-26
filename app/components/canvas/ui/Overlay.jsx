import React from 'react';

import ScreenLockButton from './ScreenLockButton';

function Overlay(props) {
  const { 
    isFullscreen,
    isLocked,
    toggleLock,
  } = props.options;

  return (
    <>
      <ScreenLockButton
        isFullscreen={isFullscreen}
        isLocked={isLocked}
        toggleLock={toggleLock}
      />
    </>
  );
}

export default Overlay;
