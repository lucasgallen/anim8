import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { savePen } from '/app/actions/drawpass';
import { rgbaColor } from '/app/helpers';

import { Range, Label } from '/app/components/styles/atoms';
import { colorSelectStyles } from '../styles';

const MIN_WIDTH = 1;
const MAX_WIDTH = 20;

const Preview = styled.div.attrs(props => ({
  style: {
    background: colorSelectStyles(props),
    height: `${props.width}px`,
    width: `${props.width}px`,
  }
}))`
  border: 2px solid white;
  border-radius: 100%;
  display: inline-block;
`;

const Container = styled.div`
  align-items: center;
  display: flex;
  height: ${MAX_WIDTH / 10}rem;
  max-width: 30rem;
  width: 100%;
`;

const RangeInput = styled(Range)`
  margin-right: 1rem;
  width: calc(100% - 1rem - ${props => props.previewWidthMax}px);
`;

const RangeLabel = styled(Label)`
  border: 0;
  margin: 0;
  overflow: hidden;
  padding: 0;
  width: 0;
`;

function PenWidthSlider(props) {
  const [width, setWidth] = useState(props.pen.width || MIN_WIDTH);

  useEffect(() => {
    props.savePen({ width: width });
  }, [width]);

  const handleChange = e => {
    setWidth(e.currentTarget.value);
  };

  const previewWidth = width => (+width * 1.5) + 2;

  return (
    <Container>
      <RangeLabel>pen width</RangeLabel>
      <RangeInput
        type='range' min={MIN_WIDTH} max={MAX_WIDTH} step='1'
        onChange={e => handleChange(e)}
        previewWidthMax={previewWidth(MAX_WIDTH)}
        value={ width }
        width={'20rem'}
      />
      <Preview
        color={rgbaColor(props.pen)}
        width={previewWidth(width)}
      />
    </Container>
  );
}

const mapStateToProps = state => {
  return {
    pen: state.pen,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ savePen }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PenWidthSlider);
