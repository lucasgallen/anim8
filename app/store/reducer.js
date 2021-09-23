import { savePage } from './helpers.js';

const reducer = (initialState) => (state = initialState, action) => {
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
  case 'SET_CAN_MOVE':
    return (Object.assign({}, state,
      {
        ui: { ...state.ui, ...action.payload }
      }
    ));
  case 'SET_DATA_URL':
    return (Object.assign({}, state,
      {
        dataURL: action.payload
      }
    ));
  case 'SET_DRAW_DISABLED':
    return (Object.assign({}, state,
      {
        ui: { ...state.ui, ...action.payload }
      }
    ));
  case 'SET_IDLE':
    return (Object.assign({}, state,
      {
        idle: action.payload
      }
    ));
  case 'SET_IS_LOCKED':
    return (Object.assign({}, state,
      {
        ui: { ...state.ui, ...action.payload }
      }
    ));
  case 'SET_FULLSCREEN':
    return (Object.assign({}, state,
      {
        ui: { ...state.ui, ...action.payload }
      }
    ));
  case 'SET_LOADING':
    return (Object.assign({}, state,
      {
        loading: action.payload
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

export default reducer;
