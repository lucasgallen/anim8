import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { savePage } from '../../actions/flipbook.js';
import { ClearButton } from './styles';

class ClearCanvasButton extends React.Component {
  clearPage() {
    const canvas = this.props.targetCanvas;
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
