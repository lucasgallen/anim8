import React from 'react';
import { useSelector } from 'react-redux';
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
    canClear,
    containerID,
  } = useSelector(state => ({
    canClear: state.ui.canClear,
    containerID: state.ui.canvasContainerID,
  }));

  const { next, prev } = props;

  const canvasEl = () => {
    const container = document.getElementById(containerID);

    return container.querySelector('canvas[data-shadow="false"]');
  };

  return (
    <>
      <FlipbookNav>
        { next && next(canvasEl()) }
        { prev && prev(canvasEl()) }
      </FlipbookNav>
      {
        canClear &&
        <ClearCanvasButton targetCanvas={canvasEl()} />
      }
      <ScreenLockButton/>

      <RedoUndo/>
    </>
  );
}

export default Overlay;
