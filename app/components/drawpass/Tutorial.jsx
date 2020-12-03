import React, { useState, useEffect } from 'react';

import NewSessionResponse from './NewSessionResponse';
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

  const slides = [
    {
      copy: 'DrawPass allows you to start a drawing and pass it along to a friend to collaborate on with a simple URL.',
      imagePath: ''
    },{
      copy: 'First draw on the canvas with your mouse (or touchscreen) and the provided UI.',
      imagePath: ''
    },{
      copy: 'Then when you\'re ready for a friend to add to the drawing, simply click "save image" and share the provided URL!',
      imagePath: ''
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
