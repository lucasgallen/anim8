import React from 'react';
import ReactDOM from 'react-dom';
import Flipbook from './components/Flipbook';
import store from './store';

const render = () => {
    ReactDOM.render(
        <Flipbook store={store} pages={store.getState().pages} />,
        document.getElementById('root')
    );
};

store.subscribe(render);
render();
