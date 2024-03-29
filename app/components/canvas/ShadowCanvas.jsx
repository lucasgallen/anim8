import React from 'react';
import { connect } from 'react-redux';

import { StyledCanvas } from './styles';

class ShadowCanvas extends React.Component {
  componentDidMount() {
    this.canvasContext = this.canvas.getContext('2d');
  }

  componentDidUpdate() {
    if (this.props.canvasDataURL === '') {
      this.clearDrawing();
    } else {
      this.loadDrawing(true);
    }
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

  loadDrawing() {
    const canvasImgURL = this.props.canvasDataURL;
    let img = new Image();

    img.src = canvasImgURL;
    img.onload = () => {
      this.drawShadow(img);
    };
  }

  clearDrawing() {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render() {
    return (
      <StyledCanvas
        left={this.props.canvasPosition.left}
        top={this.props.canvasPosition.top}
        width={this.props.width}
        height={this.props.height}
        ref={(canvas) => this.canvas = canvas}
        isShadow={true}
      ></StyledCanvas>
    );
  }
}

const mapStateToProps = state => {
  return {
    canvasPosition: state.ui.canvasPosition,
  };
};

export default connect(mapStateToProps)(ShadowCanvas);
