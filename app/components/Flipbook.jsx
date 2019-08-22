import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { addPage, savePage } from '../actions/actions.js';
import { Button, Global } from './atoms';
import Canvas from './Canvas';
import GifWindow from './GifWindow';

const NavBox = styled.div`
  margin: 0;
  padding: 0;
  width: 60rem;
`;

const Title = styled.h2`
  display: inline-block;
  left: 1rem;
  position: absolute;
  text-transform: uppercase;
  top: 0;
  z-index: 1;
`;

class Flipbook extends React.Component {
  constructor(props) {
    super(props);

    this.state = { page: 1 };
  }

  componentDidMount() {
    this.canvasImg = '';
    this.shadowImg = '';
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
    this.canvasImg = this.canvasComponent.canvas.toDataURL();

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
      id: this.state.page - 1,
    });
  }

  clearPage() {
    let canvas = this.canvasComponent.canvas;
    let shadowCanvas = this.shadowCanvas.canvas;
    let ctx = canvas.getContext('2d');
    let shadowCtx = shadowCanvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shadowCtx.clearRect(0, 0, canvas.width, canvas.height);
  }

  render() {
    let canvasImg = '';
    let shadowImg = '';

    if (this.props.pages.length && this.state.page - 1 < this.props.pages.length) {
      canvasImg = this.props.pages[this.state.page - 1].canvasImg;
    }

    if (this.props.pages.length && this.state.page - 2 >= 0) {
      shadowImg = this.props.pages[this.state.page - 2].canvasImg;
    } else {
      shadowImg = '';
    }

    return (
      <div>
        <div style={{ position: 'relative' }}>
          <Global backgroundColor='cadetblue' />
          <Title>Page: {this.state.page}</Title>
          <Canvas
            store={this.props.store}
            renderUI
            canvasImg={canvasImg}
            ref={(canvas) => this.canvasComponent = canvas}
          />

          <Canvas
            store={this.props.store}
            isShadow
            canvasImg={shadowImg}
            ref={(canvas) => this.shadowCanvas = canvas}
          />
        </div>

        <NavBox>
          <Button
            onClick={() => this.prevPage()}
            side='left'
          >prev</Button>

          <Button
            onClick={() => this.nextPage()}
            side='right'
          >next</Button>
        </NavBox>

        <GifWindow
          store={this.props.store}
          pages={this.props.pages}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    pages: state.pages,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ addPage, savePage }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Flipbook);
