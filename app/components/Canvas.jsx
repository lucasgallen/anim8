import React from 'react';

import {StyledCanvas} from './atoms';

class Canvas extends React.Component {
  componentDidMount() {
    this.canvasContext = this.canvas.getContext('2d');
    this.isPenDown = false;
  }

  componentDidUpdate() {
    this.loadDrawing();
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

  drawTouchPath(e) {
    let touchPos;

    e.preventDefault();
    if (e.touches.length > 1) return;
    if (!this.isPenDown) return;

    touchPos = this.relativeMousePos(e.touches[0]);
    this.canvasContext.lineTo(touchPos.x, touchPos.y);
    this.canvasContext.stroke();
  }

  endPath() {
    this.isPenDown = false;
  }

  loadDrawing() {
    let img = new Image();

    img.src = this.props.canvasImg;
    img.onload = () => {
      this.canvasContext.drawImage(img, 0, 0);
    };
  }

  render() {
    return (
      <StyledCanvas
        onMouseDown={() => this.startPath()}
        onTouchStart={() => this.startPath()}
        onMouseMove={(e) => this.drawPath(e)}
        onTouchMove={(e) => this.drawTouchPath(e)}
        onMouseUp={() => this.endPath()}
        onTouchEnd={() => this.endPath()}
        width={this.props.width || '600'}
        height={this.props.height || '600'}
        ref={(canvas) => this.canvas = canvas}
      ></StyledCanvas>
    );
  }
}

export default Canvas;
