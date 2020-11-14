import React from 'react';

import { Button } from '../styles/atoms';
import { Container, Copy } from './styles/tutorialSlide.jsx';

function TutorialSlide(props) {
  const copy = props.slide.copy;

  return (
    <Container>
      <Copy>{ copy }</Copy>
      {
        !props.first &&
        <Button
          style={{ float: 'left' }}
          onClick={() => props.prevStage()}
        >prev</Button>
      }

      {
        !props.last &&
        <Button
          style={{ float: 'right' }}
          onClick={() => props.nextStage()}
        >next</Button>
      }

      {
        props.last &&
        <Button
          style={{ display: 'block', margin: '0 auto' }}
          onClick={props.createNewSession}
        >try it out!</Button>
      }
    </Container>
  );
}

export default TutorialSlide;
