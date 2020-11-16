import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPenNib, faTimes } from '@fortawesome/free-solid-svg-icons';

import Header from './components/Header';
import Home from './components/Home';
import LazyDrawPass from './components/LazyDrawPass';
import LazyFlipbook from './components/LazyFlipbook';

library.add(faPenNib, faTimes);

const HEADER_HEIGHT = '8rem';

render (
  <Provider store={store}>
    <Router basename='/'>
      <Switch>
        <Route path="/drawpass">
          <Header height={HEADER_HEIGHT} />
          <LazyDrawPass headerHeight={HEADER_HEIGHT} />
        </Route>
        <Route path="/flipbook">
          <Header height={HEADER_HEIGHT} />
          <LazyFlipbook headerHeight={HEADER_HEIGHT} />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);
