import styled from 'styled-components';
import { slideY } from '../../styles/keyframes';

const Container = styled.div`
  animation-name: ${props => slideY(props.start, props.end)};
  animation-duration: 0.5s;
  animation-timing-function: sine;
  animation-fill-mode: forwards;
  margin: 0 auto 0;
  max-width: 55rem;
  position: relative;
  width: 75%;

  @media (min-width: 700px)  {
    margin: 0 auto;
  }
`;

const Title = styled.div`
  display: inline-block;
  box-shadow: 1rem 0 0 -1px aquamarine, 3rem 0 0 -1rem cadetblue, 5rem 0 0 -2rem black;
  font-family: sans-serif;
  font-size: 45px;
  font-weight: bold;
  margin: 0 3rem 2rem 0;
  padding: 3rem 1rem;
  text-align: center;
  width: auto;

  @media (min-width: 700px) {
    box-shadow: 1.5rem 0 0 -1px aquamarine, 4.5rem 0 0 -1.5rem cadetblue, 7.5rem 0 0 -3rem black;
    margin: 0 auto 2rem;
    padding: 7rem 3rem;
  }
`;

export {
  Container,
  Title,
};
