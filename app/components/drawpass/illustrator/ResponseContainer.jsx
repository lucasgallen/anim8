import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  font-size: 2.7rem;
  margin-top: 3rem;
`;

export default function ResponseContainer({ children }) {
  return <StyledDiv>{ children }</StyledDiv>;
}
