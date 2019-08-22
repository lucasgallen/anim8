import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';

import Flipbook from './components/Flipbook';

render (
  <Provider store={store}>
    <Flipbook />
  </Provider>,
  document.getElementById('root')
);
