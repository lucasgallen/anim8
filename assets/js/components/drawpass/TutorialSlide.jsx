import React from 'react';
import styled from 'styled-components';

import { Button } from '../styles/atoms';

const Copy = styled.p`
  font-size: 2rem;
  line-height: 2.5rem;
  margin: 0 0 1rem;
`;

function TutorialSlide(props) {
  const copy = props.slide.copy;

  return (
    <div>
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
    </div>
  );
}

export default TutorialSlide;
