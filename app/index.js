import React from 'react';
import ReactDOM from 'react-dom';
import Canvas from './components/Canvas';
import store from './store';

const render = () => {
    ReactDOM.render(
        <Canvas store={store} />,
        document.getElementById('root')
    );
};

store.subscribe(render);
render();
