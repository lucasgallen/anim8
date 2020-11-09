import React, { Suspense } from 'react';
import Loading from './Loading';

const Flipbook = React.lazy(() => import('./flipbook/Flipbook'));

function LazyFlipbook(props) {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Flipbook {...props} />
      </Suspense>
    </div>
  );
}

export default LazyFlipbook;
