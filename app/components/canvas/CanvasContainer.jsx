import React from 'react';

import { Container } from './styles';

import CanvasColorPicker from './CanvasColorPicker';
import Canvas from './Canvas';
import ShadowCanvas from './ShadowCanvas';

class CanvasContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { canvasDims: {}, pen: {}, colors: [], colorCardsActive: false };
    this.canvasRef = React.createRef();
    this.canvasContainerRef = React.createRef();
  }

  componentDidMount() {
    this.setState({
      canvasDims: {
        height: this.canvasContainerRef.current.getBoundingClientRect().height,
        width: this.canvasContainerRef.current.getBoundingClientRect().width,
      }
    });
  }

  updatePenColor(color) {
    const newPen = { ...this.state.pen, color: color };
    this.setState({
      pen: newPen
    });
  }

  render() {
    return (
      <>
        <Container
          ref={this.canvasContainerRef}
          isSaving={this.props.isSaving}
        >
          <Canvas
            renderUI
            background={this.props.shadowCanvas ? 'transparent' : 'white'}
            pen={this.state.pen}
            canvasImg={this.props.canvasImg}
            height={this.props.height}
            width={this.props.width}
            ref={this.canvasRef}
          />

          {
            this.props.shadowCanvas &&
            <ShadowCanvas
              canvasImg={this.props.shadowImg}
              height={this.props.height}
              width={this.props.width}
              ref={(canvas) => this.shadowCanvas = canvas}
            />
          }
        </Container>

        { this.props.children }

        <CanvasColorPicker
          placement='bottomRight'
          updatePenColor={color => this.updatePenColor(color)}
          onClick={e => console.log(e)}
        />
      </>
    );
  }
}

export default CanvasContainer;
