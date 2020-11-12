import React from 'react';
import styled from 'styled-components';

import 'rc-color-picker/assets/index.css';
import ColorPicker from 'rc-color-picker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button } from '../styles/atoms';
import { slideX } from '../styles/keyframes';
import Canvas from './Canvas';
import ShadowCanvas from './ShadowCanvas';

// TODO: Move pen color picker into separate component!!!
const MAX_COLOR_CARD_WIDTH = 26;

/*
const Title = styled.h2`
  display: inline-block;
  left: 1rem;
  position: absolute;
  text-transform: uppercase;
  top: 1rem;
  z-index: 1;
`;
*/

const Container = styled.div`
  box-shadow: 1px 1px 2px 1px #00000017;
  height: 0;
  ${props => props.isSaving ? 'pointer-events: none;' : ''}
  ${props => props.isSaving ? 'filter: blur(3px);' : ''}
  margin-bottom: 0.5rem;
  padding-bottom: 42.85%;
  position: relative;
  transition: filter 0.5s ease-in-out;
`;

const PenButtonWrapper = styled.div`
  background-color: white !important;
  border: 2px solid black;
  margin-top: 1rem;
  padding: 1rem;
  position: relative;

  &::before {
    content: '';
    background-color: ${props => props.color};
    right: 0.5rem;
    height: 1rem;
    width: 1rem;
    position: absolute;
    bottom: 0.5rem;
    border-radius: 0.5rem;
  }
`;

const ColorCardContainer = styled.div`
  cursor: pointer;
  height: 4.2rem;
  left: calc(100% + 1rem);
  margin: 0;
  overflow: auto;
  position: absolute;
  padding-left: ${props => {
    if (props.active) return '0rem';
    return `${4 + (props.colorCount - 1)}rem`;
  }};
  transition: width 0.25s;
  top: 0;
  white-space: nowrap;
  width: ${props => props.active ? `${props.dynamicWidth}rem` : '0'};
`;

const ColorCard = styled.div`
  background-color: ${props => props.color};
  display: inline-block;
  height: 4rem;
  left: ${props => props.active ? 0 : `${props.colorIndex}rem`};
  margin-left: ${props => props.active ? '1rem' : 0};
  position: ${props => props.active ? 'relative' : 'absolute'};
  top: 0;
  width: 4rem;
`;

const ColorCardCloseButton = styled(Button)`
  animation-name: ${props => slideX(props.start, props.end)};
  animation-duration: 0.2s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  background-color: transparent;
  border: none;
  display: block;
  font-size: 2rem;
  opacity: ${props => props.active ? 1 : 0};
  position: absolute;
  transition: opacity 0.2s;
  top: -0.2rem;
`;

const SaveColorButton = styled(Button)`
  width: 100%;
`;

class CanvasContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { canvasDims: {}, pen: {}, colors: [], colorCardsActive: false };
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.setState({
      canvasDims: {
        height: this.canvasContainerRef.getBoundingClientRect().height,
        width: this.canvasContainerRef.getBoundingClientRect().width,
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
          ref={ref => this.canvasContainerRef = ref}
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
              <FontAwesomeIcon icon='pen-nib' size='3x' />

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
                <FontAwesomeIcon icon='times' size='1x' />
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
