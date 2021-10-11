import styled from 'styled-components';
import { ColorPicker } from 'rc-color-picker';

import { Button } from '../styles/atoms';

const GRADIENT_WIDTH = 4;

function colorSelectStyles(props) {
  return `
    linear-gradient(${`${props.color},${props.color}`}),
    repeating-linear-gradient(0deg, transparent, transparent ${GRADIENT_WIDTH}px, rgba(0, 0, 0, 0.0980392) ${GRADIENT_WIDTH}px, rgba(0, 0, 0, 0.0980392) ${GRADIENT_WIDTH * 2}px),
    repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.0980392), rgba(0, 0, 0, 0.0980392) ${GRADIENT_WIDTH}px, transparent ${GRADIENT_WIDTH}px, transparent ${GRADIENT_WIDTH * 2}px),
    white
  `;
}

const ClearButton = styled(Button)`
  background: black;
  color: white;
  position: absolute;
  bottom: 1rem;
`;

const ColorCard = styled.div.attrs(props => ({
  style: { background: colorSelectStyles(props) }
}))`
  border: 1px solid white;
  display: inline-block;
  height: 4rem;
  right: 0;
  position: absolute;
  transform: rotate(${props => `${props.rotation}deg`});
  transform-origin: bottom left;
  width: 4rem;

  ${props => props.active ? `
    margin: 0 0 1rem 1rem;
    position: relative;
    transform: rotate(0);
  ` : ''}
`;

const ColorCardContainer = styled.div`
  align-items: flex-end;
  cursor: pointer;
  display: flex;
  margin-left: 2.4rem;
  position: relative;
  white-space: nowrap;
  width: 8rem;

  ${props => props.active ? `
    align-content: center;
    background: repeating-linear-gradient(
      -45deg,
      #fff,
      #fff 10px,
      #555 10px,
      #555 20px
    );
    justify-content: space-around;
    flex-wrap: wrap;
    left: 25vw;
    margin: 0;
    padding-top: 1rem;
    position: absolute;
    width: 50vw;
  ` : ''}
`;

const CustomColorPicker = styled(ColorPicker)`
  .rc-color-picker-panel {
    max-width: 28rem;
    width: 100%;
  }

  .rc-color-picker-panel-board-hsv {
    height: 0px;
    padding-bottom: 100%;
    width: 100%;
  }

  .rc-color-picker-panel-wrap {
    height: 6.5rem;

    .rc-color-picker-panel-wrap-ribbon, .rc-color-picker-panel-wrap-alpha {
      height: 3rem;
      right: 8.1rem;
    }
  }

  .rc-color-picker-panel-preview {
    height: 6.5rem;
    width: 6.5rem;

    span, input[type=color] {
      width: 100%;
    }
  }

  .rc-color-picker-panel-wrap[style='height: 40px; margin-top: 6px;'] {
    display: none;
  }
`;

const PenButtonWrapper = styled.div`
  background-color: white;
  border: 2px solid black;
  margin-top: 1rem;
  padding-bottom: 85%;
  position: relative;
`;

const PenIndicator = styled.span.attrs(props => ({
  style: { background: colorSelectStyles(props) }
}))`
    border-radius: 0.5rem;
    bottom: 0.5rem;
    height: 2rem;
    position: absolute;
    right: 0.5rem;
    width: 2rem;
  }
`;

const SaveColorButton = styled(Button)`
  width: 100%;
`;

const StyledCanvas = styled.canvas.attrs(props => ({
  'data-shadow': `${props.isShadow || false}`,
  style: {
    height: `${props.height}px`,
    left: `${props.left}px` || '0',
    top: `${props.top}px` || '0',
    width: `${props.width}px`,
  }
}))`
  background: ${props => props.isShadow ? 'white' : props.background || 'transparent'};
  bottom: ${props => props.isShadow && '2px'};
  box-shadow: 0px 0px 6px 1px #00000038;
  left: 0;
  position: absolute;
  top: 0;
  touch-action: none;
  z-index: ${props => !props.isShadow && 2};
`;

const Container = styled.div`
  background: repeating-linear-gradient(
    45deg,
    #5f9ea0,
    #5f9ea0 10px,
    #868692 10px,
    #868692 20px
  );
  box-shadow: 1px 1px 2px 1px #00000017;
  height: 0;
  ${props => props.isSaving ? 'pointer-events: none;' : ''}
  margin-bottom: 0.5rem;
  overflow: hidden;
  padding-bottom: 70.665%;
  position: relative;
  touch-action: none;
  width: 100%;

  canvas {
    cursor: ${props => props.hasGrip ? 'grabbing' : 'grab'};
    ${props => props.locked ? 'cursor: crosshair;' : ''}
    ${props => props.isSaving ? 'filter: blur(3px);' : ''}
    transition: filter 0.5s ease-in-out;
  }

  &:fullscreen {
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 0;
  }
`;

export {
  ClearButton,
  ColorCard,
  ColorCardContainer,
  Container,
  CustomColorPicker,
  PenButtonWrapper,
  PenIndicator,
  SaveColorButton,
  StyledCanvas,

  colorSelectStyles,
};
