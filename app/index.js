import React from 'react';
import ReactDOM from 'react-dom';

class DrawPassCanvas extends React.Component {
    render() {
        return (
            <canvas id="drawpass-canvas"></canvas>
        );
    }
}

ReactDOM.render(
    <DrawPassCanvas />,
    document.getElementById('root')
);

