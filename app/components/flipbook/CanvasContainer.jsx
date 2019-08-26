import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import 'rc-color-picker/assets/index.css';
import ColorPicker from 'rc-color-picker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

class CanvasContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { canvasDims: {}, pen: {} };
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

  changeColor(e) {
    this.setState({
      pen: { color: e.color },
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
            </PenButtonWrapper>
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
