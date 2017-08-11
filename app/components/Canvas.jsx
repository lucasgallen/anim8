import React from 'react';

class Canvas extends React.Component {
    componentDidMount() {
        const canvasContext = this.canvas.getContext('2d');

        this.canvasContext = canvasContext;
        this.isPenDown = false;
    }

    startPath() {
        this.canvasContext.beginPath();
        this.isPenDown = true;
    }

    relativeMousePos(e) {
        let rect = this.canvas.getBoundingClientRect();

        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    drawPath(e) {
        if (this.isPenDown) {
            let mousePos = this.relativeMousePos(e);

            this.canvasContext.lineTo(mousePos.x, mousePos.y);
            this.canvasContext.stroke();
        }
    }

    endPath() {
        this.isPenDown = false;
    }

    saveDrawing() {
        const canvas = this.canvas.toDataURL();
        this.props.store.dispatch({
            type: 'SAVE_DRAWING',
            canvasImg: canvas
        });
    }

    loadDrawing() {
        const canvasImgURL = this.props.store.getState().drawing.canvasImg;
        let img = new Image();

        img.src = canvasImgURL;
        img.onload = () => this.canvasContext.drawImage(img, 0, 0);
    }

    clearDrawing() {
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    render() {
        let pageNumber = this.state.currentPage + 1;

        return (
            <div>
                <h2>{pageNumber}</h2>
                <canvas
                    onMouseDown={() => this.startPath()}
                    onMouseMove={(e) => this.drawPath(e)}
                    onMouseUp={() => this.endPath()}
                    width="600"
                    height="600"
                    ref={(canvas) => this.canvas = canvas }
                ></canvas>

                <button
                    onClick={() => this.saveCanvas()}
                >save</button>

                <button
                    onClick={() => this.clearCanvas()}
                >clear</button>

                <button
                    onClick={() => this.loadCanvas()}
                >load</button>
            </div>
        );
    }
}

export default Canvas;
