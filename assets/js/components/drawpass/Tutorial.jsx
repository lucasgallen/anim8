import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { changeStage } from '../../actions/drawpass.js';

class Tutorial extends React.Component {
  constructor(props) {
    super(props);
    this.state = { step: 0 };
  }

  prevStage() {
    const currentStep = this.state.step;
    this.setState({ step: currentStep - 1 });
  }

  nextStage() {
    const currentStep = this.state.step;
    this.setState({ step: currentStep + 1 });
  }

  // TODO: put copy here with correct markup and the annotated images
  tutorialStep() {
    switch (this.state.step) {
      case 0:
        return this.stepOne();
      case 1:
        return this.stepTwo();
    }
  }

  stepOne() {
    return (
      <div>
        <p>tutorial step one</p>
        <button
          onClick={() => this.nextStage()}
        >next</button>
      </div>
    );
  }

  stepTwo() {
    return (
      <div>
        <p>tutorial step two</p>
        <button
          onClick={() => this.prevStage()}
        >prev</button>
        <button
          onClick={() => this.props.createNewSession()}
        >get drawing</button>
      </div>
    );
  }

  render() {
    return this.tutorialStep();
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ changeStage }, dispatch);
};

export default connect(null, mapDispatchToProps)(Tutorial);
