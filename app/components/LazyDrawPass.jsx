import React, { Suspense } from 'react';
import Loading from './Loading';

import useAppContainer from '/app/hooks/useAppContainer';

const DrawPass = React.lazy(() => import('./drawpass/DrawPass'));

function LazyDrawPass(props) {
  const appContainer = useAppContainer(props);

  return appContainer(
    <Suspense fallback={<Loading />}>
      <DrawPass {...props} />
    </Suspense>
  );
}

export default LazyDrawPass;
