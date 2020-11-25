import styled from 'styled-components';

import { Button } from '../styles/atoms';
import { slideX } from '../styles/keyframes';

const ClearButton = styled(Button)`
  background: black;
  color: white;
`;

const ColorCard = styled.div`
  background-color: ${props => props.color};
  display: inline-block;
  height: 4rem;
  left: ${props => props.active ? 0 : `${props.colorIndex}rem`};
  margin-left: ${props => props.active ? '1rem' : 0};
  position: ${props => props.active ? 'relative' : 'absolute'};
  top: 0;
  width: 4rem;
`;

const ColorCardCloseButton = styled(Button)`
  animation-name: ${props => slideX(props.start, props.end)};
  animation-duration: 0.2s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  background-color: transparent;
  border: none;
  display: block;
  font-size: 2rem;
  opacity: ${props => props.active ? 1 : 0};
  position: absolute;
  transition: opacity 0.2s;
  top: -0.2rem;
`;

const ColorCardContainer = styled.div`
  cursor: pointer;
  height: 4.2rem;
  left: calc(100% + 1rem);
  margin: 0;
  overflow: auto;
  position: absolute;
  padding-left: ${props => {
    if (props.active) return '0rem';
    return `${4 + (props.colorCount - 1)}rem`;
  }};
  transition: width 0.25s;
  top: 0;
  white-space: nowrap;
  width: ${props => props.active ? `${props.dynamicWidth}rem` : '0'};
`;


const PenButtonWrapper = styled.div`
  background-color: white !important;
  border: 2px solid black;
  margin-top: 1rem;
  padding: 1rem;
  position: relative;

  &::before {
    content: '';
    background-color: ${props => props.color};
    right: 0.5rem;
    height: 1rem;
    width: 1rem;
    position: absolute;
    bottom: 0.5rem;
    border-radius: 0.5rem;
  }
`;

const SaveColorButton = styled(Button)`
  width: 100%;
`;

const StyledCanvas = styled.canvas.attrs(props => ({
  'data-shadow': `${props.isShadow || false}`,
  style: {
    left: `${props.left}px` || '0',
    top: `${props.top}px` || '0'
  }
}))`
  background: ${props => props.isShadow ? 'white' : props.background || 'transparent'};
  bottom: ${props => props.isShadow && '2px'};
  box-shadow: 0px 0px 6px 1px #00000038;
  position: absolute;
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
  ${props => props.isSaving ? 'filter: blur(3px);' : ''}
  margin-bottom: 0.5rem;
  overflow: hidden;
  padding-bottom: 70.665%;
  position: relative;
  touch-action: none;
  transition: filter 0.5s ease-in-out;
  width: 100%;

  &:fullscreen {
    align-items: center;
    background: lavender;
    display: flex;
    justify-content: center;
    padding: 0;

    ${StyledCanvas} {
      position: relative;
    }
  }
`;

export {
  ClearButton,
  ColorCard,
  ColorCardCloseButton,
  ColorCardContainer,
  Container,
  PenButtonWrapper,
  SaveColorButton,
  StyledCanvas,
};
