import React from 'react';
import ReactDOM from 'react-dom';

class DrawPassCanvas extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            canvas: null
        };
    }

    componentDidMount() {
        var canvas = document.getElementById('drawpass-canvas'),
            canvasContext = canvas.getContext('2d');

        this.canvasContext = canvasContext;
        this.canvas = canvas;
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


    saveCanvas() {
        var canvas = this.canvas.toDataURL(),
            img = new Image();

        img.src = canvas;

        this.setState({
            canvas: img
        });
    }

    loadCanvas() {
        this.canvasContext.drawImage(this.state.canvas, 0, 0);
    }

    clearCanvas() {
        this.canvasContext.clearRect(0, 0, this.canvas.height, this.canvas.width);
    }

    render() {
        return (
            <div>
                <canvas
                    onMouseDown={() => this.startPath()}
                    onMouseMove={(e) => this.drawPath(e)}
                    onMouseUp={() => this.endPath()}
                    width="600"
                    height="600"
                    id="drawpass-canvas"
                ></canvas>

                <button
                    onClick={() => this.saveCanvas()}
                >save</button>

                <button
                    onClick={() => this.loadCanvas()}
                >load</button>

                <button
                    onClick={() => this.clearCanvas()}
                >clear</button>
            </div>
        );
    }
}

ReactDOM.render(
    <DrawPassCanvas />,
    document.getElementById('root')
);

