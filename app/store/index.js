import { createStore } from 'redux';
import reducer from './reducer.js';

const initialState = {
  colors: [{ color: '000', alpha: 1 }],
  canvas: { index: 0, dataURLs: [] },
  loading: false,
  pages: [],
  pen: {
    alpha: 1,
    color: '000',
    isEraser: false,
    width: 3,
  },
  screen: {
    height: window.screen.availHeight,
    width: window.screen.availWidth,
  }
};

const anim8 = reducer(initialState);

const store = createStore(
  anim8,
  window.__REDUX_DEVTOOLS_EXTENTION__ && window.__REDUX_DEVTOOLS_EXTENTION__()
);

export default store;
