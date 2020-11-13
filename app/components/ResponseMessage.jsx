import React from 'react';
import styled from 'styled-components';

const StyledMessage = styled.p`
  display: inline-block;
  font-size: 3rem;
  text-align: center;
  width: 100%;
`;

const ResponseMessage = props => {
  return (
    <>
      <StyledMessage>{props.message}</StyledMessage>
    </>
  );
};

export default ResponseMessage;
