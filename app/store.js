import { createStore } from 'redux';

const initialState = {
  pages: [],
  drawing: {}
};

const savePage = (state, action) => {
  let pages = JSON.parse(JSON.stringify(state.pages));

  pages[action.id] = {
    canvasImg: action.canvasImg
  };

  return pages;
};

const canvas = (state = initialState, action) => {
  switch (action.type) {
  case 'ADD_PAGE':
    return (Object.assign({}, state,
      {
        pages: [...state.pages,
          { canvasImg: action.canvasImg, pageID: action.id }
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
  default:
    return state;
  }
};

let store = createStore(canvas);

export default store;
