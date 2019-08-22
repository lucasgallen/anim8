import styled, { createGlobalStyle } from 'styled-components';

const Global = createGlobalStyle`
  html, body {
    background-color: ${props => props.backgroundColor};
    font-family: sans-serif;
    font-size: 10px;
  }
`;

const Button = styled.button`
  background-color: #fff;
  border: 2px solid #000;
  color: #000;
  cursor: pointer;
  display: inline-block;
  float: ${props => props.side};
  padding: 1rem;
  text-decoration: none;
  text-transform: uppercase;
`;

const StyledCanvas = styled.canvas`
  background: ${props => props.isShadow ? 'white' : 'transparent'};
  bottom: ${props => props.isShadow && '2px'};
  left: 0;
  position: ${props => props.isShadow ? 'absolute' : 'relative'};
  z-index: ${props => !props.isShadow && 2};
`;

export {
  Global,
  Button,
  StyledCanvas,
};
