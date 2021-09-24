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
    currentCanvasIndex,
    next,
    prev,
    redo,
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
        props.canClearCanvas &&
        <ClearCanvasButton targetCanvas={canvasEl()} />
      }
      <ScreenLockButton/>

      <RedoUndo redo={redo} undo={undo} indexState={currentCanvasIndex} />
    </>
  );
}

const mapStateToProps = state => (
  {
    canClear: state.ui.canClear,
    containerId: state.ui.canvasContainerID,
  }
);

export default connect(mapStateToProps)(Overlay);
