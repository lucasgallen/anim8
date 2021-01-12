import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Range, Label } from '/app/components/styles/atoms';

const MIN_WIDTH = 1;
const MAX_WIDTH = 20;

const Preview = styled.div.attrs(props => ({
  style: {
    height: `${props.width}px`,
    width: `${props.width}px`,
  }
}))`
  background-color: black;
  border-radius: 100%;
  display: inline-block;
  margin-left: 1rem;
`;

const Container = styled.div`
  align-items: center;
  display: flex;
  height: ${MAX_WIDTH / 10}rem;
  max-width: 30rem;
  width: 100%;
`;

const RangeInput = styled(Range)`
  width: 70%;
`;

const RangeLabel = styled(Label)`
  border: 0;
  margin: 0;
  overflow: hidden;
  padding: 0;
  width: 0;
`;

function PenWidthSlider(props) {
  const [width, setWidth] = useState(MIN_WIDTH);

  useEffect(() => {
    props.updatePenWidth(width);
  }, [width]);

  const handleChange = e => {
    setWidth(e.currentTarget.value);
  };

  return (
    <Container>
      <RangeLabel>pen width</RangeLabel>
      <RangeInput
        type='range' min={MIN_WIDTH} max={MAX_WIDTH} step='1'
        onChange={e => handleChange(e)}
        value={ width }
        width={'20rem'}
      />
      <Preview
        width={(+width * 1.5) + 2}
      />
    </Container>
  );
}

export default PenWidthSlider;
