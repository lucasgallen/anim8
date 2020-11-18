import React from 'react';
import { Provider } from 'react-redux';

import Flipbook from './Flipbook';

import store from '/app/store';

function App(props) {
  return (
    <Provider store={store}>
      <Flipbook {...props}/>
    </Provider>
  );
}

export default App;
