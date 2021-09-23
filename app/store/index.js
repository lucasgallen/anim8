import { createStore } from 'redux';
import reducer from './reducer.js';

const MIN_DATA_URL = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

const initialState = {
  colors: [{ color: '000', alpha: 1 }],
  canvas: { index: 0, dataURLs: [] },
  dataURL: MIN_DATA_URL,
  idle: false,
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
  },
  ui: {
    canMove: true,
    canvasContainerID: 'canvas-container',
    drawDisabled: true,
    fullscreen: false,
    isLocked: false,
  }
};

const anim8 = reducer(initialState);

const store = createStore(
  anim8,
  window.__REDUX_DEVTOOLS_EXTENTION__ && window.__REDUX_DEVTOOLS_EXTENTION__()
);

export default store;
