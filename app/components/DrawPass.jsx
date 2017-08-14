import React from 'react';
import Canvas from './Canvas';

class DrawPass extends React.Component {
    saveDrawing() {
        const canvas = this.canvasComponent.canvas.toDataURL();
        this.props.store.dispatch({
            type: 'SAVE_DRAWING',
            canvasImg: canvas
        });
    }

    render() {
        return (
            <div>
                <Canvas
                    store={this.props.store}
                    ref={(canvas) => this.canvasComponent = canvas}
                />

                <button
                    onClick={() => this.saveDrawing()}
                >save</button>

                <button
                    onClick={() => this.canvasComponent.loadDrawing()}
                >load</button>
            </div>
        );
    }
}

export default DrawPass;
