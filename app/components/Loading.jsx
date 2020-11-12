import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 100vh;
  overflow: hidden;
  position: relative;
  width: 100vw;
`;

const LoadingBlock = styled.div`
  align-items: center;
  bottom: 0;
  box-shadow: 0.5rem 0 10px 0 #00000085;
  display: flex;
  font-size: calc(2.5rem + 1vw);
  justify-content: center;
  position: absolute;
  left: 0;
  width: 100vw;
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
