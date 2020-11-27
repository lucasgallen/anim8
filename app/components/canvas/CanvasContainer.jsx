import React from 'react';

import { Container } from './styles';

import Canvas from './Canvas';
import CanvasUI from './CanvasUI';
import ShadowCanvas from './ShadowCanvas';

const HEIGHT = 595;
const WIDTH = 842;

class CanvasContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      canMove: true,
      canvasPos: {},
      drawDisabled: true,
      grabStartPos: {},
      hasGrip: false,
      isFullscreen: false,
      positionLock: false,
      pen: {}
    };

    this.canvasRef = React.createRef();
    this.canvasContainerRef = React.createRef();
  }

  componentDidMount() {
    this.setFullscreenHandler();
  }

  componentWillUnmount() {
    this.unsetFullscreenHandler();
  }

  updatePenColor(color) {
    const newPen = { ...this.state.pen, color: color };
    this.setState({
      pen: newPen
    });
  }

  grabCanvas(e) {
    if (this.state.positionLock) return;
    if (!this.state.canMove) return;

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

  openFullscreen() {
    const container = this.canvasContainerRef.current;
    container.requestFullscreen();
  }

  exitFullscreen() {
    document.exitFullscreen();
  }

  toggleFullscreen() {
    const fullscreenEl = document.fullscreenElement;

    if (fullscreenEl) {
      this.exitFullscreen();
    } else {
      this.openFullscreen();
    }
  }

  setFullscreenHandler() {
    const container = this.canvasContainerRef.current;
    if (!container) return;

    container.onfullscreenchange = () => this.handleFullscreenChange();
  }

  unsetFullscreenHandler() {
    const container = this.canvasContainerRef.current;
    if (!container) return;

    container.onfullscreenchange = null;
  }

  handleFullscreenChange() {
    const fullscreenEl = document.fullscreenElement;
    if (fullscreenEl) {
      this.handleFullscreenStart();
    } else {
      this.handleFullscreenEnd();
    }

    // Call after fullscreen has set
    // TODO: find a way to 'know' when fullscreen is finished
    // (safari/ie don't provide promise functionality)
    setTimeout(() => this.centerCanvasPosition());
  }

  centerCanvasPosition() {
    const container = this.canvasContainerRef.current;

    const left = (container.getBoundingClientRect().width - WIDTH) * 0.5;
    const top = (container.getBoundingClientRect().height - HEIGHT) * 0.5;

    this.setState({
      canvasPos: {
        left: left,
        top: top
      }
    });
  }

  handleFullscreenStart() {
    this.setState({ isFullscreen: true });
  }

  handleFullscreenEnd() {
    this.setState({ isFullscreen: false });
  }

  toggleLock() {
    const isLocked = this.state.positionLock;
    this.setState({
      positionLock: !isLocked,
      drawDisabled: isLocked
    });
  }

  menuOpts() {
    return {
      colorPickerParent: this.canvasContainerRef.current,
      isFullscreen: this.state.isFullscreen,
      updatePenColor: color => this.updatePenColor(color),
    };
  }

  overlayOpts() {
    return {
      isFullscreen: this.state.isFullscreen,
      isLocked: this.state.positionLock,
      toggleLock: () => this.toggleLock(),
    };
  }

  setCanMove(canMove) {
    this.setState({ canMove: canMove });
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
            background={this.props.shadowCanvas ? 'transparent' : 'white'}
            pen={this.state.pen}
            canvasImg={this.props.canvasImg}
            height={this.props.height || HEIGHT}
            width={this.props.width || WIDTH}
            ref={this.canvasRef}
            drawDisabled={this.state.drawDisabled}
            position={this.state.canvasPos}
          />

          {
            this.props.shadowCanvas &&
            <ShadowCanvas
              canvasImg={this.props.shadowImg}
              height={this.props.height || HEIGHT}
              width={this.props.width || WIDTH}
              ref={(canvas) => this.shadowCanvas = canvas}
              position={this.state.canvasPos}
            />
          }

          <CanvasUI
            canFullscreen={this.props.canFullscreen}
            isFullscreen={this.state.isFullscreen}

            menuOpts={this.menuOpts()}
            overlayOpts={this.overlayOpts()}

            setCanMove={canMove => this.setCanMove(canMove)}
            toggleFullscreen={() => this.toggleFullscreen()}
          />
        </Container>

        {/* TODO: account for flipbook navigation in CanvasUI */}
        { this.props.children }
      </>
    );
  }
}

export default CanvasContainer;
