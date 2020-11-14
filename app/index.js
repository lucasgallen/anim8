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

import Home from './components/Home';
import LazyDrawPass from './components/LazyDrawPass';
import LazyFlipbook from './components/LazyFlipbook';

library.add(faPenNib, faTimes);

render (
  <Provider store={store}>
    <Router basename='/'>
      <Switch>
        <Route exact path="/" render={props => <Home {...props} />} />
        <Route path="/drawpass">
          <LazyDrawPass />
        </Route>
        <Route path="/flipbook" render={props => <LazyFlipbook {...props} />} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);
