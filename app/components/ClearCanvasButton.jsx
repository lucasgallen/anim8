import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { savePage } from '../actions/actions.js';
import {Button} from './atoms';

const ClearButton = styled(Button)`
  background: black;
  color: white;
`;

class ClearCanvasButton extends React.Component {
  clearPage() {
    const canvas = this.props.targetCanvas.current.canvas;
    canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
  }

  render() {
    return (
      <ClearButton
        onClick={() => this.clearPage()}
        side='inherit'
      >clear page</ClearButton>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    pages: state.pages,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ savePage }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ClearCanvasButton);
