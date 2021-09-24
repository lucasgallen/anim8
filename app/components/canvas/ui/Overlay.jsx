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
  const { next, prev } = props.options;

  const canvasEl = () => {
    const container = document.getElementById(props.containerId);

    return container.querySelector('canvas[data-shadow="false"]');
  };

  return (
    <>
      <FlipbookNav>
        { next && next(canvasEl()) }
        { prev && prev(canvasEl()) }
      </FlipbookNav>
      {
        props.canClear &&
        <ClearCanvasButton targetCanvas={canvasEl()} />
      }
      <ScreenLockButton/>

      <RedoUndo/>
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
