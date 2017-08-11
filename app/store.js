import { createStore } from 'redux';

const canvas = (state = {pages: [], drawing: {}}, action) => {
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

/*
state:
{
    pages: [{},{},...],
    drawing: {}
}
*/
