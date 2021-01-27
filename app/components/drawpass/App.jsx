import React from 'react';
import { Provider } from 'react-redux';

import DrawPass from './DrawPass';

import store from '/app/store';

function App(props) {
  return (
    <Provider store={store}>
      <DrawPass {...props}/>
    </Provider>
  );
}

export default App;
