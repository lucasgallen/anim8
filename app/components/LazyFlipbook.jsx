import React, { Suspense } from 'react';
import Loading from './Loading';

import useAppContainer from '/app/hooks/useAppContainer';

const Flipbook = React.lazy(() => import('./flipbook/App'));

function LazyFlipbook(props) {
  const appContainer = useAppContainer(props);

  return appContainer(
    <div>
      <Suspense fallback={<Loading />}>
        <Flipbook {...props} />
      </Suspense>
    </div>
  );
}

export default LazyFlipbook;
