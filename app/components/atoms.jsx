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
  top: 0;
  touch-action: none;
  z-index: ${props => !props.isShadow && 2};
`;

const Label = styled.label`
  border-bottom: 2px solid fuchsia;
  border-right: 2px solid fuchsia;
  display: inline-block;
  font-size: 14px;
  font-weight: 300;
  margin: 0.5rem 1rem 0;
  padding: 0 0.4rem 0.2rem 0;
  position: relative;
  text-transform: uppercase;
  vertical-align: top;

  &::before {
    background-color: black;
    border-radius: 1rem;
    content: '';
    display: block;
    height: 0.3rem;
    position: absolute;
    top: 0.25rem;
    right: -1rem;
    width: 0.3rem;
  }

  &::after {
    background-color: black;
    border-radius: 1rem;
    content: '';
    display: block;
    height: 0.3rem;
    position: absolute;
    right: -1rem;
    top: 1rem;
    width: 0.3rem;
  }
`;

const Input = styled.input`
  border: 2px solid cadetblue;
  display: inline-block;
  font-size: 1.5rem;
  padding: 0.25rem;
  margin: 0 0.5rem;
  width: 7rem;
`;

export {
  Global,
  Button,
  StyledCanvas,
  Label,
  Input,
};
