import React from 'react';
import styled from 'styled-components';

import { reveal } from '../styles/keyframes';
import { Button } from '../styles/atoms';

const Container = styled.div`
  animation-name: ${reveal};
  animation-duration: 1.5s;
  animation-timing-function: sine;
  overflow: hidden;
`;

const Copy = styled.p`
  font-size: 2rem;
  line-height: 2.5rem;
  margin: 0 0 1rem;
`;

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
          onClick={() => props.createNewSession()}
        >try it out!</Button>
      }
    </Container>
  );
}

export default TutorialSlide;
