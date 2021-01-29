import { createStore } from 'redux';

const initialState = {
  colors: [{ color: '000', alpha: 1 }],
  canvas: { index: 0, dataURLs: [] },
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

const savePage = (state, action) => {
  let pages = JSON.parse(JSON.stringify(state.pages));

  pages[action.payload.pageIndex] = {
    dataURL: action.payload.dataURL,
  };

  return pages;
};

const anim8 = (state = initialState, action) => {
  switch (action.type) {
  case 'ADD_COLOR':
    return (Object.assign({}, state,
      {
        colors: [...state.colors,
          action.payload
        ]
      }
    ));
  case 'ADD_PAGE':
    return (Object.assign({}, state,
      {
        pages: [...state.pages,
          action.payload
        ]
      }
    ));
  case 'SAVE_CANVAS':
    return (Object.assign({}, state,
      {
        canvas: { ...state.canvas, ...action.payload }
      }
    ));
  case 'SAVE_COLORS':
    return (Object.assign({}, state,
      {
        colors: action.payload
      }
    ));
  case 'SAVE_PEN':
    return (Object.assign({}, state,
      {
        pen: {...state.pen, ...action.payload}
      }
    ));
  case 'SAVE_PAGE':
    return (Object.assign({}, state,
      {
        pages: savePage(state, action)
      }
    ));
  case 'UPDATE_SCREEN':
    return (Object.assign({}, state,
      {
        screen: action.payload
      }
    ));
  default:
    return state;
  }
};

const store = createStore(
  anim8,
  window.__REDUX_DEVTOOLS_EXTENTION__ && window.__REDUX_DEVTOOLS_EXTENTION__()
);

export default store;
