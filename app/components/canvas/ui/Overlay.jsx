import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import ScreenLockButton from './ScreenLockButton';
import RedoUndo from './RedoUndo';
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
    currentCanvasIndex,
    isLocked,
    next,
    prev,
    redo,
    toggleLock,
    undo,
  } = props.options;

  const canvasEl = () => {
    const container = document.getElementById(props.ui.containerId);

    return container.querySelector('canvas[data-shadow="false"]');
  };

  return (
    <>
      <FlipbookNav>
        { next && next(canvasEl()) }
        { prev && prev(canvasEl()) }
      </FlipbookNav>
      {
        canClearCanvas &&
        <ClearCanvasButton targetCanvas={canvasEl()} />
      }
      <ScreenLockButton
        isLocked={isLocked}
        toggleLock={toggleLock}
      />

      <RedoUndo redo={redo} undo={undo} indexState={currentCanvasIndex} />
    </>
  );
}

const mapStateToProps = state => (
  {
    containerId: state.ui.canvasContainerID,
  }
);

export default connect(mapStateToProps)(Overlay);
