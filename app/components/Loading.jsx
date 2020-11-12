import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  bottom: 0;
  left: 0;
  overflow: hidden;
  position: absolute;
  right: 0;
  top: 0;
`;

const LoadingBlock = styled.div`
  align-items: center;
  bottom: 0;
  display: flex;
  font-size: calc(2.5rem + 1vw);
  justify-content: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
`;

const Copy = styled.p`
`;

function Loading() {
  return (
    <Container>
      <LoadingBlock>
        <Copy>LOADING...</Copy>
      </LoadingBlock>
    </Container>
  );
}

export default Loading;
