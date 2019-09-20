import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/drawpass';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPenNib, faTimes } from '@fortawesome/free-solid-svg-icons';

import DrawPass from './components/drawpass/DrawPass';

const root = document.getElementById('root');

library.add(faPenNib, faTimes);

render (
  <Provider store={store}>
    <DrawPass
      sessionId={root.dataset["sessionId"]}
      authToken={root.dataset["authToken"]}
    />
  </Provider>,
  root
);
