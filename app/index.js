import React from 'react';
import ReactDOM from 'react-dom';

class DrawPassCanvas extends React.Component {
    componentDidMount() {
        var canvasContext = document.getElementById('drawpass-canvas').getContext('2d');

        this.canvasContext = canvasContext;
        this.isPenDown = false;
    }

    startPath() {
        this.canvasContext.beginPath();
        this.isPenDown = true;
    }

    drawPath(e) {
        if (this.isPenDown) {
            this.canvasContext.lineTo(e.clientX, e.clientY);
            this.canvasContext.stroke();
        }
    }

    endPath() {
        this.isPenDown = false;
    }

    render() {
        return (
            <canvas
                onMouseDown={() => this.startPath()}
                onMouseMove={(e) => this.drawPath(e)}
                onMouseUp={() => this.endPath()}
                id="drawpass-canvas"
            ></canvas>
        );
    }
}

ReactDOM.render(
    <DrawPassCanvas />,
    document.getElementById('root')
);

