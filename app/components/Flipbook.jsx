import React from 'react';
import Canvas from './Canvas';

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
      <div>
        <h2>Page: {this.state.page}</h2>
        <Canvas
          store={this.props.store}
          renderUI={true}
          canvasImg={canvasImg}
          ref={(canvas) => this.canvasComponent = canvas}
          style={{ position: 'relative', zIndex: 2 }}
        />

        <Canvas
          store={this.props.store}
          isShadow={true}
          canvasImg={shadowImg}
          ref={(canvas) => this.shadowCanvas = canvas}
          style={{ position: 'absolute', top: '68px' }}
        />

        <button
          onClick={() => this.prevPage()}
        >prev</button>

        <button
          onClick={() => this.nextPage()}
        >next</button>
      </div>
    );
  }
}

export default Flipbook;
