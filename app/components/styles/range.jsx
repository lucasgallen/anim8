import styled from 'styled-components';

const $trackColor = '#eceff1';
const $thumbColor = '#607d8b';

const $thumbRadius = '12px';
const $thumbHeight = '24px';
const $thumbWidth = '24px';
const $thumbShadowSize = '4px';
const $thumbShadowBlur = '4px';
const $thumbShadowColor = 'rgba(0, 0, 0, .2)';
const $thumbBorderWidth = '2px';
const $thumbBorderColor = '#eceff1';

const $trackWidth = '100%';
const $trackHeight = '8px';
const $trackShadowSize = '1px';
const $trackShadowBlur = '1px';
const $trackShadowColor = 'rgba(0, 0, 0, .2)';
const $trackBorderWidth = '2px';
const $trackBorderColor = '#cfd8dc';

const $trackRadius = '5px';

const shadow = (shadowSize, shadowBlur, shadowColor) => {
  return `box-shadow: ${shadowSize} ${shadowSize} ${shadowBlur} ${shadowColor}, 0 0 ${shadowSize} ${shadowColor};`;
};

const track = () => {
  return `
    cursor: default;
    height: ${$trackHeight};
    transition: all .2s ease;
    width: ${$trackWidth};
  `;
};

const thumb = () => {
  return `
    ${shadow($thumbShadowSize, $thumbShadowBlur, $thumbShadowColor)}
    background: ${$thumbColor};
    border: ${$thumbBorderWidth} solid ${$thumbBorderColor};
    border-radius: ${$thumbRadius};
    box-sizing: border-box;
    cursor: default;
    height: ${$thumbHeight};
    width: ${$thumbWidth};
  `;
};

const Range = styled.input`
  -webkit-appearance: none;
  background: transparent;
  margin: calc(${$thumbHeight}/2) 0;
  width: ${$trackWidth};

  &::-moz-focus-outer {
    border: 0;
  }

  &:focus {
    outline: 0;

    &::-webkit-slider-runnable-track {
      background: ${$trackColor};
    }

    &::-ms-fill-lower {
      background: ${$trackColor};
    }

    &::-ms-fill-upper {
      background: ${$trackColor};
    }
  }

  &::-webkit-slider-runnable-track {
    ${track()}
    ${shadow($trackShadowSize, $trackShadowBlur, $trackShadowColor)}
    background: ${$trackColor};
    border: ${$trackBorderWidth} solid ${$trackBorderColor};
    border-radius: ${$trackRadius};
  }

  &::-webkit-slider-thumb {
    ${thumb()}
    -webkit-appearance: none;
    margin-top: calc((-${$trackBorderWidth} * 2 + ${$trackHeight})/2 - ${$thumbHeight} / 2);
  }

  &::-moz-range-track {
    ${shadow($trackShadowSize, $trackShadowBlur, $trackShadowColor)}
    ${track()}
    background: ${$trackColor};
    border: ${$trackBorderWidth} solid ${$trackBorderColor};
    border-radius: ${$trackRadius};
    height: ${$trackHeight} / 2;
  }

  &::-moz-range-thumb {
    ${thumb()}
  }

  &:disabled {
    &::-webkit-slider-thumb,
    &::-moz-range-thumb,
    &::-webkit-slider-runnable-track {
      cursor: not-allowed;
    }
  }
`;

export default Range;
