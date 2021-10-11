import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { saveCanvas } from '/app/actions/drawpass';

import { Button } from '/app/components/styles/atoms';

const Container = styled.div`
  bottom: 5rem;
  display: flex;
  justify-content: space-between;
  max-width: 30rem;
  min-width: 13rem;
  position: absolute;
  width: 30vw;
  z-index: 3;
`;

function RedoUndo() {
  const dispatch = useDispatch();
  const {
    index,
    dataURLs,
  } = useSelector(state => ({
    index: state.canvas.index,
    dataURLs: state.canvas.dataURLs,
  }));

  const [state, setState] = useState({ canRedo: false, canUndo: false });

  const handleRedo = () => {
    const newState = { index: index + 1 };

    dispatch(saveCanvas(newState));
  };

  const handleUndo = () => {
    const newState = { index: index - 1 };

    dispatch(saveCanvas(newState));
  };

  useEffect(() => {
    const indexState = {
      current: index,
      max: dataURLs.length - 1
    };
    const undo = (indexState.current > 0);
    const redo = (indexState.current < indexState.max);

    setState({ canRedo: redo, canUndo: undo });
  }, [index, dataURLs.length]);

  const disabled = isDisabled => {
    return isDisabled ? 'disabled' : false;
  };

  return (
    <Container>
      <Button onClick={handleUndo} disabled={disabled(!state.canUndo)}>Undo</Button>
      <Button onClick={handleRedo} disabled={disabled(!state.canRedo)}>Redo</Button>
    </Container>
  );
}

export default RedoUndo;
