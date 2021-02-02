import React from 'react';

import { Button } from '/app/components/styles/atoms';
import { Body, Buttons, Container, Copy } from '../styles/tutorialSlide.jsx';

function TutorialSlide(props) {
  return (
    <Container>
      <Body>
        <Copy>{ props.slide.copy }</Copy>
        { props.slide.imagePath && <img src={ props.slide.imagePath } /> }
      </Body>
      <Buttons>
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
            style={{ float: 'right' }}
            onClick={props.createNewSession}
          >try it out!</Button>
        }
      </Buttons>
    </Container>
  );
}

export default TutorialSlide;
