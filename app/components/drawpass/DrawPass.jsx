import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { changeStage, NEW_STAGE, DRAW_STAGE, TUTORIAL_STAGE } from '../../actions/drawpass.js';
import NewSessionResponse from './NewSessionResponse';
import StageRouter from './StageRouter';

import { Container, Title } from './styles/drawpass';

class DrawPass extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      canvasImg: '',
      loadingNewSession: false,
      response: {},
    };
  }

  componentDidMount() {
    this.maybeOpenSession();
    this.maybeStartNewSession();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.slug !== prevProps.match.params.slug) {
      this.maybeOpenSession();
      this.maybeStartNewSession();
    }
  }

  createNewSession() {
    this.setState({ loadingNewSession: true });

    fetch('/api/session_groups/new_session', {
      method: 'get',
      headers: new Headers({
        'Authorization': `Token token=${process.env.API_TOKEN}`,
        'Content-Type': 'application/json',
      }),
    }).then(res => this.handleNewSessionResponse(res))
      .then(data => this.handleCreateSessionSuccess(data));
  }

  handleNewSessionResponse(res) {
    this.setState({ loadingNewSession: false, response: res });
    return res.ok ? res.json() : {};
  }

  handleCreateSessionSuccess(response) {
    if (!Object.keys(response).length) return;

    const imageData = response.data.relationships.shared_image;

    this.setState({
      canvasImg: imageData.meta.data_url || '',
    }, () => {
      this.props.history.push(`${this.props.location.pathname}/${response.data.id}`);
    });

    this.props.changeStage(DRAW_STAGE);
  }

  maybeStartNewSession() {
    if (this.props.sessionId !== 'new') return;

    this.props.changeStage(NEW_STAGE);
  }

  maybeOpenSession() {
    if (this.props.sessionId === 'new') return;

    // TODO: check if image is ready to edit
    fetch(`/api/session_group/${this.props.match.params.slug}`, {
      method: 'get',
      headers: new Headers({
        'Authorization': `Token token=${process.env.API_TOKEN}`,
        'Content-Type': 'application/json',
      }),
    }).then(response => response.json())
      .then(data => this.handleOpenSession(data));
  }

  handleOpenSession(response) {
    this.setState({
      canvasImg: response.data.relationships.shared_image.meta.data_url || ''
    }, () => {
      this.props.changeStage(DRAW_STAGE);
    });
  }


  containerSlide() {
    let slide = { start: '0', end: 'calc(50vh - 50%)' };

    switch (this.props.drawpassStage) {
    case TUTORIAL_STAGE:
      slide.end = '5rem';
      slide.start = 'calc(50vh - 50%)';
      return slide;
    case DRAW_STAGE:
      slide.end = '5rem';
      slide.start = 'calc(50vh - 50%)';
      return slide;
    }

    return slide;
  }

  render() {
    const slide = this.containerSlide();

    return (
      <Container
        start={slide.start}
        end={slide.end}
      >
        <Title><h1>drawpass</h1></Title>
        <StageRouter
          canvasImg={this.state.canvasImg}
          createNewSession={() => this.createNewSession()}
          loadingNewSession={this.state.loadingNewSession}
          match={this.props.match}
          stage={this.props.drawpassStage}
        />
        <NewSessionResponse
          loading={this.state.loadingNewSession}
          response={this.state.response}
        />
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    drawpassStage: state.drawpassStage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ changeStage }, dispatch);
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DrawPass));
