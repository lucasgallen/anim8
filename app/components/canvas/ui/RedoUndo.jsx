import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

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

function RedoUndo(props) {
  const [state, setState] = useState({ canRedo: false, canUndo: false });

  useEffect(() => {
    const undo = (props.indexState.current > 0);
    const redo = (props.indexState.current < props.indexState.max);

    setState({ canRedo: redo, canUndo: undo });
  }, [props.indexState]);

  const disabled = isDisabled => {
    return isDisabled ? 'disabled' : false;
  };

  return (
    <Container>
      <Button onClick={() => props.undo()} disabled={disabled(!state.canUndo)}>Undo</Button>
      <Button onClick={() => props.redo()} disabled={disabled(!state.canRedo)}>Redo</Button>
    </Container>
  );
}

export default RedoUndo;
