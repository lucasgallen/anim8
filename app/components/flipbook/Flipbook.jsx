import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { addPage, savePage, updateScreen } from '../../actions/flipbook.js';
import { saveColors } from '/app/actions/drawpass.js';
import { Button, Global } from '../styles/atoms';
import CanvasContainer from '../canvas/CanvasContainer';
import GifWindow from './GifWindow';

const Container = styled.div`
  margin: 0 auto;
  overflow: hidden;
  padding: 2.5rem 0;
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

    this.state = { page: 1, dataURL: '', canvasDims: {} };
    this.throttle = false;
  }

  componentDidMount() {
    this.props.saveColors([{ color: '000', alpha: 1 }]);
  }

  getCanvasEl() {
    return (
      this.canvasContainer.canvasContainerRef.current.querySelector('canvas[data-shadow="false"]')
    );
  }

  prevPage(canvasEl) {
    if (this.state.page > 1) {
      this.clearPage(canvasEl);

      this.setState({
        page: this.state.page - 1
      });
    }
  }

  addPage() {
    this.props.addPage({
      dataURL: this.state.dataURL,
      id: this.state.page,
    });
  }

  nextPage(canvasEl) {
    this.setState({ dataURL: canvasEl.toDataURL() }, () => {
      if (this.state.page - 1 === this.props.pages.length) {
        this.addPage();
      }

      this.savePage();
      this.clearPage(canvasEl);
      this.setState({
        dataURL: canvasEl.toDataURL(),
        page: this.state.page + 1,
      });
    });
  }

  savePage() {
    this.props.savePage({
      dataURL: this.state.dataURL,
      pageIndex: this.state.page - 1,
    });
  }

  clearPage(canvasEl) {
    let shadowCanvas = canvasEl.parentElement.querySelector('canvas[data-shadow="true"]');
    let ctx = canvasEl.getContext('2d');
    let shadowCtx = shadowCanvas.getContext('2d');

    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    shadowCtx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  }

  getCanvasImage() {
    if (this.state.page - 1 >= this.props.pages.length) return;

    return this.props.pages[this.state.page - 1].dataURL;
  }

  getShadowCanvasDataURL() {
    if (!this.props.pages.length) return;
    if (this.state.page - 2 < 0) return;

    return this.props.pages[this.state.page - 2].dataURL;
  }

  PrevButton(canvasEl) {
    return (
      <Button
        disabled={this.state.page > 1 ? false : 'disabled'}
        onClick={() => this.prevPage(canvasEl)}
        side='left'
        hoverColor={'white'}
        hoverBackground={'black'}
      >prev</Button>
    );
  }

  NextButton(canvasEl) {
    return (
      <Button
        onClick={() => this.nextPage(canvasEl)}
        side='right'
        hoverColor={'white'}
        hoverBackground={'black'}
      >next</Button>
    );
  }

  render() {
    const dataURL = this.getCanvasImage() || this.state.dataURL;
    const shadowDataURL = this.getShadowCanvasDataURL() || '';

    return (
      <Container>
        <Global backgroundColor='' />
        <FlipbookContainer>
          <CanvasContainer
            key={'flipbook'}
            page={this.state.page}
            next={canvasEl => this.NextButton(canvasEl)}
            prev={canvasEl => this.PrevButton(canvasEl)}
            dataURL={dataURL}
            shadowDataURL={shadowDataURL}
            shadowCanvas
            background='white'
            canFullscreen={true}
            canClearCanvas={true}
            setCanvasDims={dims => this.setState({ canvasDims: dims })}
          />
        </FlipbookContainer>

        <GifWindow
          height={this.state.canvasDims.height || 1}
          width={this.state.canvasDims.width || 1}
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
  return bindActionCreators({ addPage, saveColors, savePage, updateScreen }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Flipbook);
