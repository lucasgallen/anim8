import styled from 'styled-components';
import { reveal } from '../../styles/keyframes';

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
  margin: 0 0 1rem;
`;

export {
  Container,
  Copy,
};
