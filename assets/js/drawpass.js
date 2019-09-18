import React from 'react';
import { render } from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPenNib, faTimes } from '@fortawesome/free-solid-svg-icons';

import DrawPass from './components/DrawPass';

library.add(faPenNib, faTimes);

render (
  <DrawPass />,
  document.getElementById('root')
);
