import { createStore } from 'redux';

const initialState = {
    pages: [],
    drawing: {}
};

const canvas = (state = initialState, action) => {
    switch (action.type) {
    case 'SAVE_PAGE':
        return (Object.assign({}, state,
            {
                pages: [...state.pages,
                    { canvasImg: action.newPage, pageID: action.id }
                ]
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
