import React from 'react';
import styled from 'styled-components';

import ScreenLockButton from './ScreenLockButton';
import ClearCanvasButton from './ClearCanvasButton';

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
    canClearCanvas,
    containerRef,
    isFullscreen,
    isLocked,
    next,
    prev,
    toggleLock,
  } = props.options;

  const canvasEl = () => {
    return containerRef.current.querySelector('canvas[data-shadow="false"]');
  };

  return (
    <>
      <FlipbookNav>
        { next(canvasEl()) }
        { prev(canvasEl()) }
      </FlipbookNav>
      {
        canClearCanvas &&
        <ClearCanvasButton targetCanvas={canvasEl()} />
      }
      <ScreenLockButton
        isFullscreen={isFullscreen}
        isLocked={isLocked}
        toggleLock={toggleLock}
      />
    </>
  );
}

export default Overlay;
