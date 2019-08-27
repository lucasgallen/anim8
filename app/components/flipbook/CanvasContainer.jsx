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
  height: 4rem;
  left: calc(100% + 1rem);
  margin: 0;
  position: absolute;
  padding-left: ${props => `${4 + (props.colorCount - 1)}rem`};
  top: 0;
`;

const ColorCard = styled.div`
  background-color: ${props => props.color};
  bottom: 0;
  display: inline-block;
  left: ${props => `${props.colorIndex}rem`};
  position: absolute;
  top: 0;
  width: 3rem;
`;

const SaveColorButton = styled(Button)`
  width: 100%;
`;

class CanvasContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { canvasDims: {}, pen: {}, colors: [] };
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
        <ColorCard colorIndex={index} color={val} key={index} />
      );
    });
    return cards;
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

              <ColorCardContainer colorCount={this.state.colors.length}>
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
