import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { changeStage } from '../../actions/drawpass.js';
import TutorialSlide from './TutorialSlide';

class Tutorial extends React.Component {
  constructor(props) {
    super(props);
    this.state = { step: 0 };

    this.slides = [
      {
        copy: 'DrawPass allows you to start a drawing and pass it along to a friend to collaborate on with a simple URL.',
        imagePath: ''
      },{
        copy: 'First draw on the canvas with your mouse and the provided UI.',
        imagePath: ''
      },{
        copy: 'Then when you\'re ready for a friend to add to the drawing, simply click "save" and share the provided URL!',
        imagePath: ''
      },
    ];
  }

  prevStage() {
    const currentStep = this.state.step;
    this.setState({ step: currentStep - 1 });
  }

  nextStage() {
    const currentStep = this.state.step;
    this.setState({ step: currentStep + 1 });
  }

  render() {
    return (
      <TutorialSlide
        slide={ this.slides[this.state.step] }
        prevStage={() => this.prevStage()}
        nextStage={() => this.nextStage()}
        createNewSession={() => this.props.createNewSession()}
        first={ this.state.step === 0 }
        last={ this.state.step === this.slides.length - 1 }
      />
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ changeStage }, dispatch);
};

export default connect(null, mapDispatchToProps)(Tutorial);
