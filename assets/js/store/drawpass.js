import { createStore } from 'redux';

const initialState = {
  stage: '',
};

const drawpass = (state = initialState, action) => {
  switch (action.type) {
  case 'CHANGE_STAGE':
    return (Object.assign({}, state,
      {
        stage: action.payload
      }
    ));
  default:
    return state;
  }
};

const store = createStore(
  drawpass,
  window.__REDUX_DEVTOOLS_EXTENTION__ && window.__REDUX_DEVTOOLS_EXTENTION__()
);

export default store;
