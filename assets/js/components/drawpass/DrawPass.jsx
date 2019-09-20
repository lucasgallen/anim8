import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { changeStage, NEW_STAGE, DRAW_STAGE, TUTORIAL_STAGE } from '../../actions/drawpass.js';
import Illustrator from './Illustrator';
import NewSessionPrompt from './NewSessionPrompt';
import Tutorial from './Tutorial';
import Loading from '../Loading';

class DrawPass extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        canvasImg: '',
        slug: '',
      };
  }

  componentDidMount() {
    this.maybeOpenSession();
    this.maybeStartNewSession();
  }

  createNewSession() {
    $.ajax({
      url: '/session_groups',
      contentType: 'application/json',
      type: 'post',
      beforeSend: xhr => {
        xhr.setRequestHeader("X-Csrf-Token", this.props.authToken)
      },
      success: data => this.handleCreateSessionSuccess(data)
    });
  }

  handleCreateSessionSuccess(data) {
    this.setState({
      canvasImg: data.shared_image.blob || '',
      slug: data.slug,
    });

    this.props.changeStage(DRAW_STAGE);
  }

  maybeStartNewSession() {
    if (this.props.sessionId !== 'new') return;

    this.props.changeStage(NEW_STAGE);
  }

  maybeOpenSession() {
    if (this.props.sessionId === 'new') return;
    // TODO: request session by slug
    this.props.changeStage(DRAW_STAGE);
  }

  drawPassStage() {
    switch (this.props.stage) {
      case NEW_STAGE:
        return (
          <NewSessionPrompt
            createNewSession={() => this.createNewSession()}
          />
        );
      case DRAW_STAGE:
        return (
          <Illustrator
            canvasImg={this.state.canvasImg}
          />
        );
      case TUTORIAL_STAGE:
        return (
          <Tutorial
            createNewSession={() => this.createNewSession()}
          />
        );
      default:
        return <Loading />;
    }
  }

  render() {
    return this.drawPassStage();
  }
}

const mapStateToProps = (state) => {
  return {
    stage: state.stage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ changeStage }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawPass);
