import React from 'react';

import { Button } from '../styles/atoms';
import CanvasContainer from '../canvas/CanvasContainer';

class Illustrator extends React.Component {
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

  updateScreen() {
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

  // TODO: show user image has saved
  saveImage() {
    const canvas = this.canvasContainer.canvasRef.current.canvas;
    const dataURL = canvas.toDataURL('image/png', 0.9);

    fetch(`/api/shared_image/${this.props.slug}`, {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': `Token token=${process.env.API_TOKEN}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ data_url: dataURL }),
    }).then(response => response.json());
  }

  render() {
    return (
      <div>
        <CanvasContainer
          ref={ref => this.canvasContainer = ref}
          canvasImg={this.props.canvasImg}
          height={this.state.canvasDims.height}
          width={this.state.canvasDims.width}
        />
        <Button
          onClick={() => this.saveImage()}
        >save image</Button>
      </div>
    );
  }
}

export default Illustrator;
