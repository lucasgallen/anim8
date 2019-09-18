import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPenNib, faTimes } from '@fortawesome/free-solid-svg-icons';

import Flipbook from './components/flipbook/Flipbook';

library.add(faPenNib, faTimes);

render (
  <Provider store={store}>
    <Flipbook />
  </Provider>,
  document.getElementById('root')
);
