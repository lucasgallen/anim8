import React from 'react';
import { render } from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPenNib, faTimes } from '@fortawesome/free-solid-svg-icons';

import DrawPass from './components/drawpass/DrawPass';

const root = document.getElementById('root');

library.add(faPenNib, faTimes);

// TODO: implement store for "stage" functionality
render (
  <DrawPass
    sessionId={root.dataset["sessionId"]}
    authToken={root.dataset["authToken"]}
  />,
  root
);
