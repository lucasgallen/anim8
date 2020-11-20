import React from 'react';

import 'rc-color-picker/assets/index.css';
import { ColorPicker } from 'rc-color-picker';

import {
  ColorCard,
  ColorCardCloseButton,
  ColorCardContainer,
  Container,
  PenButtonWrapper,
  SaveColorButton,
} from './styles';

import Canvas from './Canvas';
import ShadowCanvas from './ShadowCanvas';

// TODO: Move pen color picker into separate component!!!
const MAX_COLOR_CARD_WIDTH = 26;


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

  saveColor(e) {
    const currentColor = this.state.pen.color;
    let colors = [];

    e.stopPropagation();
    if (this.state.colors.indexOf(currentColor) > -1) {
      colors = this.state.colors;
    } else {
      colors = [...this.state.colors, currentColor];
    }

    this.setState({
      colors: colors,
    });
  }

  changeColor(e) {
    this.setState({
      pen: { color: e.color },
    });
  }

  colorCards() {
    let cards = [];
    this.state.colors.forEach((val, index) => {
      cards.push(
        <ColorCard
          data-index={index}
          colorIndex={index} color={val} key={index}
          onClick={e => this.pickColor(e)}
          active={this.state.colorCardsActive}
        />
      );
    });
    return cards;
  }

  expandSavedColors(e) {
    e.stopPropagation();
    this.setState({
      colorCardsActive: true,
    });
  }

  pickColor(e) {
    const penObj = this.state.pen;
    const index = e.target.dataset['index'];
    if (!this.state.colorCardsActive) return;

    e.stopPropagation();

    penObj.color = this.state.colors[index];
    this.setState({
      pen: penObj,
    });
  }

  closeColorCards(e) {
    e.stopPropagation();

    this.setState({
      colorCardsActive: false,
    });
  }

  dynamicLeft() {
    return this.dynamicWidth() + 3;
  }

  dynamicWidth() {
    const width = (this.state.colors.length * 5) + 1;
    return width < MAX_COLOR_CARD_WIDTH ? width : MAX_COLOR_CARD_WIDTH;
  }

  render() {
    return (
      <div>
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

        <ColorPicker
          onChange={e => this.changeColor(e)}
          placement='bottomRight'
        >
          <div>
            <PenButtonWrapper
              color={this.state.pen.color || 'black'}
            >

              <ColorCardContainer
                onClick={e => this.expandSavedColors(e)}
                colorCount={this.state.colors.length}
                active={this.state.colorCardsActive}
                dynamicWidth={this.dynamicWidth()}
              >
                { this.colorCards() }
              </ColorCardContainer>

              <ColorCardCloseButton
                onClick={e => this.closeColorCards(e)}
                active={this.state.colorCardsActive}
                start={this.state.colorCardsActive ? `calc(100% + ${this.dynamicLeft()}rem)` : '-10rem'}
                end={this.state.colorCardsActive ? '-10rem' : `calc(100% + ${this.dynamicLeft()}rem)` }
              >
              </ColorCardCloseButton>
            </PenButtonWrapper>

            <SaveColorButton onClick={e => this.saveColor(e)}>save</SaveColorButton>
          </div>
        </ColorPicker>
      </div>
    );
  }
}

export default CanvasContainer;
