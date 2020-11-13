import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { changeStage } from '../../actions/drawpass.js';
import TutorialSlide from './TutorialSlide';

const Tutorial = props => {
  const [step, setStep] = useState(0);

  const slides = [
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

  const prevStage = () => {
    const currentStep = step;
    setStep(currentStep - 1);
  };

  const nextStage = () => {
    const currentStep = step;
    setStep(currentStep + 1);
  };

  return (
    <TutorialSlide
      slide={slides[step]}
      prevStage={() => prevStage()}
      nextStage={() => nextStage()}
      createNewSession={props.createNewSession()}
      first={step === 0}
      last={step === slides.length - 1 }
    />
  );
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ changeStage }, dispatch);
};

export default connect(null, mapDispatchToProps)(Tutorial);
