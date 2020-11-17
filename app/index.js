import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { render } from 'react-dom';

import Header from './components/Header';
import Home from './components/Home';
import Footer from './components/Footer';
import LazyDrawPass from './components/LazyDrawPass';
import LazyFlipbook from './components/LazyFlipbook';

const HEADER_HEIGHT = '8rem';
const FOOTER_HEIGHT = '5rem';

render (
  <Router basename='/'>
    <Switch>
      <Route path="/drawpass">
        <Header height={HEADER_HEIGHT} />
        <LazyDrawPass
          headerHeight={HEADER_HEIGHT}
          footerHeight={FOOTER_HEIGHT}
        />
      </Route>
      <Route path="/flipbook">
        <Header height={HEADER_HEIGHT} />
        <LazyFlipbook
          headerHeight={HEADER_HEIGHT}
          footerHeight={FOOTER_HEIGHT}
        />
      </Route>
      <Route path="/">
        <Home footerHeight={FOOTER_HEIGHT} />
      </Route>
    </Switch>
    <Footer height={FOOTER_HEIGHT} />
  </Router>,
  document.getElementById('root')
);
