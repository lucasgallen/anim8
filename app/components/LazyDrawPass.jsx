import React, { Suspense } from 'react';
import Loading from './Loading';

const DrawPass = React.lazy(() => import('./drawpass/DrawPass'));

function LazyDrawPass(props) {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <DrawPass {...props} />
      </Suspense>
    </div>
  );
}

export default LazyDrawPass;
