import React from 'react';
import styled from 'styled-components';

const StyledSpan = styled.span`
  margin-bottom: 2rem;
`;

export default function Response({ children }) {
  return <StyledSpan>{ children }</StyledSpan>;
}
