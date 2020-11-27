import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { addPage, savePage, updateScreen } from '../../actions/flipbook.js';
import { Button, Global } from '../styles/atoms';
import CanvasContainer from '../canvas/CanvasContainer';
import GifWindow from './GifWindow';

const GIF_RATIO = 1;

const Container = styled.div`
  overflow: hidden;
  padding: 2.5rem;
  width: calc(100vw - 5rem);
`;

const FlipbookContainer = styled.div`
  height: calc(100% - 30rem);
  width: calc(20rem * 233.33%);

  @media (min-width: 700px) {
    height: calc(100% - 2rem);
    width: 100%;
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

    this.state = { page: 1, canvasDims: {} };
    this.throttle = false;

    this.canvasContainerRef = React.createRef();
  }

  componentDidMount() {
    this.canvasImg = '';
    this.shadowImg = '';
    this.canvasContainer = this.canvasContainerRef.current;

    this.canvasEl = this.getCanvasEl();
    this.shadowCanvas = this.canvasContainerRef.current.shadowCanvas;

    this.setState({
      canvasDims: {
        height: this.canvasEl.height,
        width: this.canvasEl.width,
      }
    });
  }

  getCanvasEl() {
    return (
      this.canvasContainer.canvasContainerRef.current.querySelector('canvas[data-shadow="false"]')
    );
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
    this.canvasImg = this.canvasEl.toDataURL();

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
    let shadowCanvas = this.shadowCanvas.canvas;
    let ctx = this.canvasEl.getContext('2d');
    let shadowCtx = shadowCanvas.getContext('2d');

    ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    shadowCtx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
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

  PrevButton() {
    return (
      <Button
        onClick={() => this.prevPage()}
        side='left'
        hoverColor={'white'}
        hoverBackground={'black'}
      >prev</Button>
    );
  }

  NextButton() {
    return (
      <Button
        onClick={() => this.nextPage()}
        side='right'
        hoverColor={'white'}
        hoverBackground={'black'}
      >next</Button>
    );
  }

  render() {
    const canvasImg = this.getCanvasImage() || this.cavasImg || '';
    const shadowImg = this.getShadowCanvasImage() || '';

    return (
      <Container>
        <Global backgroundColor='' />
        <FlipbookContainer>
          <CanvasContainer
            ref={this.canvasContainerRef}
            key={'flipbook'}
            page={this.state.page}
            next={this.NextButton()}
            prev={this.PrevButton()}
            canvasImg={canvasImg}
            shadowImg={shadowImg}
            shadowCanvas
            canFullscreen={true}
          />
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
