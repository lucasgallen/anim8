import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { changeStage, NEW_STAGE, DRAW_STAGE, TUTORIAL_STAGE } from '../../actions/drawpass.js';
import Illustrator from './Illustrator';
import NewSessionPrompt from './NewSessionPrompt';
import Tutorial from './Tutorial';
import Loading from '../Loading';

import { Container, LoadingContainer, Title } from './styles/drawpass';

class DrawPass extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      canvasImg: '',
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
    fetch('/api/session_groups/new_session', {
      method: 'get',
      headers: new Headers({
        'Authorization': `Token token=${process.env.API_TOKEN}`,
        'Content-Type': 'application/json',
      }),
    }).then(response => response.json())
      .then(data => this.handleCreateSessionSuccess(data));
  }

  handleCreateSessionSuccess(response) {
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

  drawPassStage() {
    switch (this.props.drawpassStage) {
    case NEW_STAGE:
      return (
        <NewSessionPrompt
          createNewSession={() => this.createNewSession()}
        />
      );
    case DRAW_STAGE:
      return (
        <Illustrator
          slug={this.props.match.params.slug}
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
      return (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      );
    }
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
        {this.drawPassStage()}
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
