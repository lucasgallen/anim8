import React from 'react';

import { Container } from './styles';

import CanvasColorPicker from './CanvasColorPicker';
import Canvas from './Canvas';
import ShadowCanvas from './ShadowCanvas';

class CanvasContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { canvasPos: {}, drawDisabled: true, grabStartPos: {}, hasGrip: false, positionLock: false, pen: {} };
    this.canvasRef = React.createRef();
    this.canvasContainerRef = React.createRef();
  }

  updatePenColor(color) {
    const newPen = { ...this.state.pen, color: color };
    this.setState({
      pen: newPen
    });
  }

  grabCanvas(e) {
    if (this.state.positionLock) return;

    this.setState({
      hasGrip: true,
      grabStartPos: this.currentPosition(e),
    });
  }

  currentPosition(e) {
    const eventRoot = e.touches ? e.touches[0] : e;
    return { x: eventRoot.clientX, y: eventRoot.clientY };
  }

  moveCanvas(e) {
    if (!this.state.hasGrip) return;
    this.currentPosition(e);

    const relPosition = this.relativeMousePos(e);
    const currentPosition = {
      x: this.state.canvasPos.left || 0,
      y: this.state.canvasPos.top || 0,
    };

    this.setState({
      grabStartPos: this.currentPosition(e),
      canvasPos: {
        left: relPosition.x + currentPosition.x,
        top: relPosition.y + currentPosition.y,
      }
    });
  }

  relativeMousePos(e) {
    const currentPos = this.currentPosition(e);

    return {
      x: currentPos.x - this.state.grabStartPos.x,
      y: currentPos.y - this.state.grabStartPos.y
    };
  }

  release() {
    this.setState({ hasGrip: false });
  }

  toggleLock() {
    const isLocked = this.state.positionLock;
    this.setState({
      positionLock: !isLocked,
      drawDisabled: isLocked
    });
  }

  render() {
    return (
      <>
        <Container
          onMouseDown={e => this.grabCanvas(e)}
          onTouchStart={e => this.grabCanvas(e)}
          onMouseMove={e => this.moveCanvas(e)}
          onTouchMove={e => this.moveCanvas(e)}
          onMouseUp={() => this.release()}
          onTouchEnd={() => this.release()}
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
            toggleScroll={this.props.toggleScroll}
            drawDisabled={this.state.drawDisabled}
            position={this.state.canvasPos}
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

          {
            this.props.openFullscreen &&
            <button style={{position: 'absolute', zIndex: '2', top: '5px', left: '5px'}} onClick={() => this.props.openFullscreen()}>fullscreen</button>
          }

          <button style={{position: 'absolute', zIndex: '2', bottom: '5px', right: '5px'}} onClick={() => this.toggleLock()}>{this.state.positionLock ? 'unlock' : 'lock'}</button>
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
