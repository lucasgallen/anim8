import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container, Copy, Button, Divider } from './styles/newSessionPrompt';

import { changeStage, TUTORIAL_STAGE } from '../../actions/drawpass.js';
//import Tutorial from './Tutorial';


function NewSessionPrompt(props) {
  return (
    <Container>
      <Copy>Familiar?</Copy>
      <Button
        loading={props.loading}
        onClick={() => props.createNewSession()}
      >get drawing</Button>

      <Divider/>

      <Copy>nope . . .</Copy>
      <Button
        loading={props.loading}
        onClick={() => props.changeStage(TUTORIAL_STAGE)}
      >What is this?</Button>
    </Container>
  );
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ changeStage }, dispatch);
};

export default connect(null, mapDispatchToProps)(NewSessionPrompt);
