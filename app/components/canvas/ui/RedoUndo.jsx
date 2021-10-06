import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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

function RedoUndo(props) {
  const [state, setState] = useState({ canRedo: false, canUndo: false });

  const handleRedo = () => {
    const newIndex = props.canvas.index + 1;
    const newState = { ...props.canvas, index: newIndex };

    props.saveCanvas(newState);
  };

  const handleUndo = () => {
    const newIndex = props.canvas.index - 1;
    const newState = { ...props.canvas, index: newIndex };

    props.saveCanvas(newState);
  };

  useEffect(() => {
    const indexState = {
      current: props.canvas.index,
      max: props.canvas.dataURLs.length - 1
    };
    const undo = (indexState.current > 0);
    const redo = (indexState.current < indexState.max);

    setState({ canRedo: redo, canUndo: undo });
  }, [props.canvas.index, props.canvas.dataURLs]);

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

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ saveCanvas }, dispatch);
};

const mapStateToProps = state => (
  {
    canvas: state.canvas,
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(RedoUndo);
