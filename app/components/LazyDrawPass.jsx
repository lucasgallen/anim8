import React, { Suspense } from 'react';
import styled from 'styled-components';
import Loading from './Loading';

const DrawPass = React.lazy(() => import('./drawpass/DrawPass'));

const AppContainer = styled.div`
  display: flex;
  align-items: center;
  min-height: ${props => `calc(100vh - ${props.headerHeight})`}
`;

function LazyDrawPass(props) {
  return (
    <AppContainer headerHeight={props.headerHeight}>
      <Suspense fallback={<Loading />}>
        <DrawPass {...props} />
      </Suspense>
    </AppContainer>
  );
}

export default LazyDrawPass;
