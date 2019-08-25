import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { addPage, savePage, updateScreen } from '../../actions/actions.js';
import { Button, Global } from '../atoms';
import CanvasContainer from './CanvasContainer';
import ClearCanvasButton from '../canvas/ClearCanvasButton';
import GifWindow from './GifWindow';

const GIF_RATIO = 1;

const NavBox = styled.div`
  margin: 0;
  padding: 0;
  text-align: center;
  width: 100%;
`;

const Container = styled.div`
  overflow: hidden;
  padding-bottom: 1rem;
`;

const FlipbookContainer = styled.div`
  height: calc(100% - 30rem);
  width: calc(20rem * 233.33%);

  @media (min-width: 700px) {
    height: calc(100% - 2rem);
    width: calc(100% - 20rem);
  }

  @media (min-width: 900px) {
    float: left;
    max-width: calc(50% - 0.5rem);
    width: 70rem;
  }
`;

class Flipbook extends React.Component {
  constructor(props) {
    super(props);

    this.state = { page: 1, canvasDims: {}};
    this.throttle = false;
  }

  componentDidMount() {
    let canvasContainer;

    this.canvasImg = '';
    this.shadowImg = '';
    this.canvasContainerRef = this.canvasContainer.wrappedInstance;
    canvasContainer = this.canvasContainerRef.canvasContainerRef;

    this.canvasRef = this.canvasContainerRef.canvasRef;
    this.shadowCanvas = this.canvasContainerRef.shadowCanvas;

    this.setState({
      canvasDims: {
        height: canvasContainer.getBoundingClientRect().height,
        width: canvasContainer.getBoundingClientRect().width,
      }
    });

    window.addEventListener('resize', e => this.updateScreen(e));
  }

  updateScreen(e) {
    const canvasContainer = this.canvasContainerRef.canvasContainerRef;
    if (this.throttle) return;

    this.throttle = true;
    setTimeout(() => { this.throttle = false; }, 500);
    this.props.updateScreen({
      height: e.currentTarget.screen.availHeight,
      width: e.currentTarget.availWidth,
    });

    this.setState({
      canvasDims: {
        height: canvasContainer.getBoundingClientRect().height,
        width: canvasContainer.getBoundingClientRect().width,
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
      <Container>
        <Global backgroundColor='cadetblue' />
        <FlipbookContainer>
          <CanvasContainer
            ref={ref => this.canvasContainer = ref}
            page={this.state.page}
            height={this.state.canvasDims.height * GIF_RATIO}
            width={this.state.canvasDims.width * GIF_RATIO}
            canvasImg={canvasImg}
            shadowImg={shadowImg}
          />

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
        </FlipbookContainer>

        <GifWindow
          height={this.state.canvasDims.height * GIF_RATIO}
          width={this.state.canvasDims.width * GIF_RATIO}
          store={this.props.store}
          pages={this.props.pages}
        />
      </Container>
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
