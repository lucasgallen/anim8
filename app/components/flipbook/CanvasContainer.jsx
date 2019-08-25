import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

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

  render() {
    return (
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

    );
  }
}

const mapStateToProps = (state) => {
  return {
    screen: state.screen,
  };
};

export default connect(mapStateToProps, null, null, { withRef: true })(CanvasContainer);
