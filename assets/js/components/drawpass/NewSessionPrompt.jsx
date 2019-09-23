import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { changeStage, TUTORIAL_STAGE } from '../../actions/drawpass.js';
import Tutorial from './Tutorial';

const Container = styled.div`
  align-items: center;
  display: grid;
  margin: 0 auto;
  max-width: 25rem;
  padding: 2.2rem 0 0;
  height: 12.5rem;

  @media (min-width: 700px) {
    float: right;
    padding: 3rem 0 0;
  }
`;

const Copy = styled.p`
  float: left;
  font-size: 2rem;
  grid-column-start: 1;
  grid-column-end: 2;
  text-transform: lowercase;
`;

const Button = styled.button`
  background: black;
  box-shadow: 0px -3px 0px 0px aquamarine inset;
  color: white;
  font-family: sans-serif;
  font-size: 1.5rem;
  grid-column-start: 2;
  line-height: 2rem;
  margin-left: 1rem;
  padding: 1rem;
  text-transform: uppercase;

  &:hover {
    background: white;
    color: black;
  }
`;

const Divider = styled.span`
  grid-column-start: 1;
  grid-column-end: 3;
  margin: 0 16rem 0 1rem;

  @media (min-width: 700px) {
    border-bottom: 1px solid black;
  }
`;

function NewSessionPrompt(props) {
  return (
    <Container>
      <Copy>Familiar?</Copy>
      <Button
        onClick={() => props.createNewSession()}
      >get drawing</Button>

      <Divider/>

      <Copy>nope . . .</Copy>
      <Button
        onClick={() => props.changeStage(TUTORIAL_STAGE)}
      >What is this?</Button>
    </Container>
  );
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ changeStage }, dispatch);
};

export default connect(null, mapDispatchToProps)(NewSessionPrompt);
