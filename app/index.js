import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPenNib, faTimes } from '@fortawesome/free-solid-svg-icons';

import Home from './components/Home';
import LazyFlipbook from './components/LazyFlipbook';
import LazyDrawPass from './components/LazyDrawPass';

library.add(faPenNib, faTimes);

const history = createBrowserHistory();

render (
  <Provider store={store}>
    <Router history={history} basename='/'>
      <Switch>
        <Route exact path="/" render={props => <Home {...props} />} />
        <Route
          basename='/'
          path="/drawpass/:slug"
          render={props => <LazyDrawPass {...props} authToken={'123sdf'} />}
        />
        <Route
          path="/drawpass"
          render={props => <LazyDrawPass {...props} sessionId={'new'} authToken={'123sdf'} />}
        />
        <Route path="/flipbook" render={props => <LazyFlipbook {...props} />} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);
