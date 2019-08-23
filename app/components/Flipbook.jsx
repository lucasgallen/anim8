import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { addPage, savePage, updateScreen } from '../actions/actions.js';
import { Button, Global } from './atoms';
import Canvas from './Canvas';
import ClearCanvasButton from './ClearCanvasButton';
import ShadowCanvas from './ShadowCanvas';
import GifWindow from './GifWindow';

const NavBox = styled.div`
  margin: 0;
  max-width: 60rem;
  padding: 0;
  text-align: center;
  width: 100%;
`;

const Title = styled.h2`
  display: inline-block;
  left: 1rem;
  position: absolute;
  text-transform: uppercase;
  top: 0;
  z-index: 1;
`;

const CanvasContainer = styled.div`
  height: 0;
  margin-bottom: 0.5rem;
  padding-bottom: 42.85%;
  position: relative;
  width: calc(20rem * 233.33%);

  @media (min-width: 700px) {
    width: calc(100% - 20rem);
  }

  @media (min-width: 900px) {
    width: calc(100% - 40rem);
  }
`;

const FlipbookContainer = styled.div`
  height: calc(100% - 30rem);

  @media (min-width: 700px) {
    height: calc(100% - 2rem);
  }
`;

class Flipbook extends React.Component {
  constructor(props) {
    super(props);

    this.state = { page: 1, canvasDims: {} };
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.canvasImg = '';
    this.shadowImg = '';

    this.setState({
      canvasDims: {
        height: this.canvasContainerRef.getBoundingClientRect().height,
        width: this.canvasContainerRef.getBoundingClientRect().width,
      }
    });

    this.throttle = false;
    window.addEventListener('resize', e => this.updateScreen(e));
  }

  updateScreen(e) {
    if (this.throttle) return;

    this.throttle = true;
    setTimeout(() => { this.throttle = false; }, 500);
    this.props.updateScreen({
      height: e.currentTarget.screen.availHeight,
      width: e.currentTarget.availWidth,
    });

    this.setState({
      canvasDims: {
        height: this.canvasContainerRef.getBoundingClientRect().height,
        width: this.canvasContainerRef.getBoundingClientRect().width,
      }
    });
  }

  prevPage() {
    if (this.state.page > 1) {
      this.clearPage();

      this.setState({
        page: this.state.page - 1
      });
    }
  }

  addPage() {
    this.props.addPage({
      canvasImg: this.canvasImg,
      id: this.state.page,
    });
  }

  nextPage() {
    this.canvasImg = this.canvasRef.current.canvas.toDataURL();

    if (this.state.page - 1 === this.props.pages.length) {
      this.addPage();
    }

    this.savePage();
    this.clearPage();
    this.setState({
      page: this.state.page + 1,
    });
  }

  savePage() {
    this.props.savePage({
      canvasImg: this.canvasImg,
      pageIndex: this.state.page - 1,
    });
  }

  clearPage() {
    let canvas = this.canvasRef.current.canvas;
    let shadowCanvas = this.shadowCanvas.canvas;
    let ctx = canvas.getContext('2d');
    let shadowCtx = shadowCanvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shadowCtx.clearRect(0, 0, canvas.width, canvas.height);
  }

  getCanvasImage() {
    if (!this.props.pages.length) return;
    if (this.state.page - 1 >= this.props.pages.length) return;

    return this.props.pages[this.state.page - 1].canvasImg;
  }

  getShadowCanvasImage() {
    if (!this.props.pages.length) return;
    if (this.state.page - 2 < 0) return;

    return this.props.pages[this.state.page - 2].canvasImg;
  }

  render() {
    const canvasImg = this.getCanvasImage() || this.cavasImg;
    const shadowImg = this.getShadowCanvasImage() || '';

    return (
      <FlipbookContainer>
        <CanvasContainer
          ref={ref => this.canvasContainerRef = ref}
        >
          <Global backgroundColor='cadetblue' />
          <Title>Page: {this.state.page}</Title>
          <Canvas
            renderUI
            canvasImg={canvasImg}
            height={this.state.canvasDims.height}
            width={this.state.canvasDims.width}
            ref={this.canvasRef}
          />

          <ShadowCanvas
            store={this.props.store}
            canvasImg={shadowImg}
            height={this.state.canvasDims.height}
            width={this.state.canvasDims.width}
            ref={(canvas) => this.shadowCanvas = canvas}
          />
        </CanvasContainer>

        <NavBox>
          <Button
            onClick={() => this.prevPage()}
            side='left'
          >prev</Button>

          <ClearCanvasButton
            targetCanvas={this.canvasRef}
          />

          <Button
            onClick={() => this.nextPage()}
            side='right'
          >next</Button>
        </NavBox>

        <GifWindow
          height={this.state.canvasDims.height}
          width={this.state.canvasDims.width}
          store={this.props.store}
          pages={this.props.pages}
        />
      </FlipbookContainer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    pages: state.pages,
    screen: state.screen,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ addPage, savePage, updateScreen }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Flipbook);
