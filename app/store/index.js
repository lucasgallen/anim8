import { createStore } from 'redux';

const initialState = {
  drawing: {},
  pages: [],
  screen: {
    height: window.screen.availHeight,
    width: window.screen.availWidth,
  }
};

const savePage = (state, action) => {
  let pages = JSON.parse(JSON.stringify(state.pages));

  pages[action.payload.pageIndex] = {
    canvasImg: action.payload.canvasImg,
  };

  return pages;
};

const anim8 = (state = initialState, action) => {
  switch (action.type) {
  case 'ADD_PAGE':
    return (Object.assign({}, state,
      {
        pages: [...state.pages,
          action.payload
        ]
      }
    ));
  case 'SAVE_PAGE':
    return (Object.assign({}, state,
      {
        pages: savePage(state, action)
      }
    ));
  case 'SAVE_DRAWING':
    return (Object.assign({}, state,
      {
        drawing: { canvasImg: action.canvasImg }
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
