import React from 'react';
import styled from 'styled-components';
import { Button, Global } from './atoms';
import Canvas from './Canvas';
import 'gif.js.optimized';

const NavBox = styled.div`
  margin: 0;
  padding: 0;
  width: 60rem;
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
    this.props.store.dispatch({
      type: 'ADD_PAGE',
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
    this.props.store.dispatch({
      type: 'SAVE_PAGE',
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
      <div style={{ position: 'relative' }}>
        <Global backgroundColor='cadetblue' />
        <h2>Page: {this.state.page}</h2>
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
      </div>
    );
  }
}

export default Flipbook;
