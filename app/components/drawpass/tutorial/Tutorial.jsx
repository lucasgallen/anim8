import React, { useState, useEffect } from 'react';

import changeColor from './change_color.gif';
import draw from './draw.gif';
import download from './download.gif';
import save from './save.gif';

import NewSessionResponse from '../NewSessionResponse';
import TutorialSlide from './TutorialSlide';

import useCreateSession from '/app/hooks/useCreateSession';

const Tutorial = props => {
  const [step, setStep] = useState(+props.step);
  const [slide, setSlide] = useState({});
  const [response, setResponse] = useState({ status: '' });

  const handleCreate = useCreateSession(props.setLoading, ({ json, response }) => {
    if (!json || !response) return;

    if (json.data && json.data.id) {
      props.toSession(json.data.id);
    }

    props.setFetchFromSlug(false);
    setResponse(response);
  });

  useEffect(() => {
    setSlide(slides[step]);
  }, []);

  useEffect(() => {
    setSlide(slides[step]);
  }, [step]);

  useEffect(() => {
    if (+props.step === +step) return;

    setStep(props.step);
  }, [props.step]);

  const slides = [
    {
      copy: 'DrawPass allows you to start a drawing and pass it along to a friend to collaborate with via a simple URL.',
    },{
      copy: 'First draw on the canvas with your mouse (or touchscreen) and the provided UI.',
      imagePath: draw,
    },{
      copy: 'Get active and experiment with different colors and line widths',
      imagePath: changeColor,
    },{
      copy: 'Then when you\'re ready for a friend to add to the drawing, simply click "save image" and share the provided URL!',
      imagePath: save,
    },{
      copy: 'The sessions are periodically deleted if they are inactive, so do not hesitate to download the session\'s drawing!',
      imagePath: download,
    },
  ];

  const prevStage = () => {
    const currentStep = step;
    setStep(currentStep - 1);
    props.toTutorial(currentStep - 1);
  };

  const nextStage = () => {
    const currentStep = step;
    setStep(currentStep + 1);
    props.toTutorial(currentStep + 1);
  };

  return (
    <>
      <TutorialSlide
        slide={slide}
        prevStage={() => prevStage()}
        nextStage={() => nextStage()}
        createNewSession={handleCreate}
        first={step === 0}
        last={step === slides.length - 1}
      />
      <NewSessionResponse
        loading={props.loading}
        response={response}
      />
    </>
  );
};

export default Tutorial;
