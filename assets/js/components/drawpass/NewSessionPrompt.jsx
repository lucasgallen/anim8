import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { changeStage, TUTORIAL_STAGE } from '../../actions/drawpass.js';
import Tutorial from './Tutorial';

function NewSessionPrompt(props) {
  return (
    <div>
      <div>
        <p>Familiar with DrawPass?</p>
        <button
          onClick={() => props.createNewSession()}
        >get drawing</button>
      </div>

      <button
        onClick={() => props.changeStage(TUTORIAL_STAGE)}
      >What is this?</button>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ changeStage }, dispatch);
};

export default connect(null, mapDispatchToProps)(NewSessionPrompt);
