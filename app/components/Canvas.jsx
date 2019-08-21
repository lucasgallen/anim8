import React from 'react';
import styled from 'styled-components';
import {Button} from './atoms';

const ClearButton = styled(Button)`
  background: black;
  color: white;
`;

const StyledCanvas = styled.canvas`
  background: ${props => props.isShadow ? 'white' : 'transparent'};
  bottom: ${props => props.isShadow && '2px'};
  position: ${props => props.isShadow ? 'absolute' : 'relative'};
  z-index: ${props => !props.isShadow && 2};
`;

class Canvas extends React.Component {
  componentDidMount() {
    const canvasContext = this.canvas.getContext('2d');

    this.canvasContext = canvasContext;
    this.canvasContext.fillStyle = 'white';
    this.canvasContext.fill();
    this.isPenDown = false;
  }

  componentDidUpdate() {
    if (this.props.canvasImg === '') {
      this.clearDrawing();
    } else {
      this.loadDrawing(true);
    }
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

  drawShadow(img) {
    const canWidth = this.canvas.width;
    const canHeight = this.canvas.height;
    const context = this.canvasContext;
    const colorDampening = 100;

    let pixels;

    context.drawImage(img, 0, 0);

    pixels = context.getImageData(0, 0, canWidth, canHeight);

    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i] = pixels.data[i] + colorDampening;
      pixels.data[i+1] = pixels.data[i+1] + colorDampening;
      pixels.data[i+2] = pixels.data[i+2] + colorDampening;
    }

    context.putImageData(pixels, 0, 0);
  }

  loadDrawing(hasDrawing) {
    const canvasImgURL = hasDrawing ? this.props.canvasImg : this.props.store.getState().drawing.canvasImg;
    let img = new Image();

    img.src = canvasImgURL;
    img.onload = () => {
      if (this.props.isShadow) {
        this.drawShadow(img);
      } else {
        this.canvasContext.drawImage(img, 0, 0);
      }
    };
  }

  clearDrawing() {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render() {
    const UI = <ClearButton
      onClick={() => this.clearDrawing()}
      side='right'
    >clear</ClearButton>;

    return (
      <div>
        <StyledCanvas
          onMouseDown={() => this.startPath()}
          onMouseMove={(e) => this.drawPath(e)}
          onMouseUp={() => this.endPath()}
          width={this.props.width || '600'}
          height={this.props.height || '600'}
          ref={(canvas) => this.canvas = canvas}
          isShadow={this.props.isShadow}
        ></StyledCanvas>

        {this.props.renderUI && UI}
      </div>
    );
  }
}

export default Canvas;
