import React from 'react';
import CanvasContainer from './drawpass/CanvasContainer';

class DrawPass extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      canvasDims: {},
      pen: {},
      colors: [],
      colorCardsActive: false
    };
  }

  componentDidMount() {
    let canvasContainer;

    this.canvasImg = '';
    // TODO: request image from session

    this.canvasContainerRef = this.canvasContainer.canvasContainerRef;
    canvasContainer = this.canvasContainerRef;

    this.setState({
      canvasDims: {
        height: canvasContainer.getBoundingClientRect().height,
        width: canvasContainer.getBoundingClientRect().width,
      }
    }, () => {
      window.addEventListener('resize', e => this.updateScreen(e));
    });
  }

  updateScreen(e) {
    const canvasContainer = this.canvasContainerRef;
    if (this.throttle) return;

    this.throttle = true;
    setTimeout(() => { this.throttle = false; }, 500);

    this.setState({
      canvasDims: {
        height: canvasContainer.getBoundingClientRect().height,
        width: canvasContainer.getBoundingClientRect().width,
      }
    });
  }

  render() {
    return (
      <CanvasContainer
        ref={ref => this.canvasContainer = ref}
        canvasImg={this.canvasImg}
        height={this.state.canvasDims.height}
        width={this.state.canvasDims.width}
      />
    );
  }
}

export default DrawPass;
