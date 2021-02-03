import React from 'react';
import styled from 'styled-components';

const TOTAL_ACCENTS = 9;
const ACCENT_WIDTH = 6;

const Container = styled.div`
  align-items: center;
  display: inline-flex;
  font-family: sans-serif;
  font-size: 45px;
  font-weight: bold;
  height: 12rem;
  margin-left: -${ACCENT_WIDTH + 2}rem;
  padding: 0;
  position: relative;
  text-align: center;
`;

const Accent = styled.span`
  background: ${props => backgrounds[props.index % 3]};
  bottom: calc(50% - ${ACCENT_WIDTH / 2}rem);
  height: 1rem;
  position: absolute;
  right: -${ACCENT_WIDTH + 2}rem;
  transform: rotate(-${props => (TOTAL_ACCENTS - 1 - props.index) * 10}deg);
  transform-origin: top left;
  width: ${ACCENT_WIDTH}rem;
  z-index: ${props => props.index};
`;

const backgrounds = ['aquamarine', 'cadetblue', 'black'];

function Title() {
  const accents = () => {
    let accents = [];
    for (let i = 0; i < TOTAL_ACCENTS; i++) {
      accents.push(<Accent key={i} index={i} />);
    }
    return accents;
  };

  return (
    <Container>
      <h1>Flipbook</h1>
      { accents() }
    </Container>
  );
}

export default Title;
