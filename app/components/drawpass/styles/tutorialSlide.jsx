import styled from 'styled-components';
import { reveal } from '../../styles/keyframes';

const Body = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-bottom: 2rem;
  padding: 1rem;

  img {
    box-shadow: 0 6px 14px rgb(0 0 0 / 30%);
    width: 20rem;
  }
`;

const Buttons = styled.div`
`;

const Container = styled.div`
  animation-name: ${reveal};
  animation-duration: 1.5s;
  animation-timing-function: sine;
  margin-bottom: 2rem;
  overflow: hidden;
  text-align: left;
`;

const Copy = styled.p`
  font-size: 2rem;
  line-height: 2.5rem;
  margin: 0 0 2rem;
  min-width: 20rem;
  width: calc(100% - 30rem);
`;

export {
  Body,
  Buttons,
  Container,
  Copy,
};
