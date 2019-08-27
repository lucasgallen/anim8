import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import 'rc-color-picker/assets/index.css';
import ColorPicker from 'rc-color-picker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button } from '../atoms';
import Canvas from '../canvas/Canvas';
import ShadowCanvas from '../canvas/ShadowCanvas';

const Title = styled.h2`
  display: inline-block;
  left: 1rem;
  position: absolute;
  text-transform: uppercase;
  top: 0;
  z-index: 1;
`;

const Container = styled.div`
  height: 0;
  margin-bottom: 0.5rem;
  padding-bottom: 42.85%;
  position: relative;
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
  height: 4rem;
  left: calc(100% + 1rem);
  margin: 0;
  position: absolute;
  overflow-x: ${props => props.active ? 'scroll' : 'none'};
  padding-left: ${props => {
    if (props.active) return '1rem';
    return `${4 + (props.colorCount - 1)}rem`;
  }};
  top: 0;
  width: ${props => props.active ? `${props.colorCount * 4}rem` : 'auto'};
`;

const ColorCard = styled.div`
  background-color: ${props => props.color};
  display: inline-block;
  height: 4rem;
  left: ${props => `${props.colorIndex}rem`};
  position: ${props => props.active ? 'relative' : 'absolute'};
  top: 0;
  width: 4rem;
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
    e.persist();

    penObj.color = this.state.colors[index];
    this.setState({
      pen: penObj,
    });
  }

  render() {
    return (
      <div>
        <Container
          ref={ref => this.canvasContainerRef = ref}
        >
          <Title>Page: {this.props.page}</Title>
          <Canvas
            renderUI
            pen={this.state.pen}
            canvasImg={this.props.canvasImg}
            height={this.props.height}
            width={this.props.width}
            ref={this.canvasRef}
          />

          <ShadowCanvas
            canvasImg={this.props.shadowImg}
            height={this.props.height}
            width={this.props.width}
            data-test='foobar'
            ref={(canvas) => this.shadowCanvas = canvas}
          />
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
              >
                { this.colorCards() }
              </ColorCardContainer>
            </PenButtonWrapper>

            <SaveColorButton onClick={e => this.saveColor(e)}>save</SaveColorButton>
          </div>
        </ColorPicker>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    screen: state.screen,
  };
};

export default connect(mapStateToProps, null, null, { withRef: true })(CanvasContainer);
