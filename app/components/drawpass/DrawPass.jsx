import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { changeStage, NEW_STAGE, DRAW_STAGE, TUTORIAL_STAGE } from '../../actions/drawpass.js';
import Illustrator from './Illustrator';
import NewSessionPrompt from './NewSessionPrompt';
import Tutorial from './Tutorial';
import Loading from '../Loading';

import { slideY } from '../styles/keyframes';

const Container = styled.div`
  animation-name: ${props => slideY(props.start, props.end)};
  animation-duration: 0.5s;
  animation-timing-function: sine;
  animation-fill-mode: forwards;
  margin: 0 auto 0;
  max-width: 55rem;
  position: relative;
  width: 75%;

  @media (min-width: 700px)  {
    margin: 0 auto;
  }
`;

const Title = styled.div`
  display: inline-block;
  box-shadow: 1rem 0 0 0 aquamarine, 3rem 0 0 -1rem cadetblue, 5rem 0 0 -2rem black;
  font-family: sans-serif;
  font-size: 45px;
  font-weight: bold;
  margin: 0 3rem 2rem 0;
  padding: 3rem 1rem;
  text-align: center;
  width: auto;

  @media (min-width: 700px) {
    box-shadow: 1.5rem 0 0 0 aquamarine, 4.5rem 0 0 -1.5rem cadetblue, 7.5rem 0 0 -3rem black;
    margin: 0 auto 2rem;
    padding: 7rem 3rem;
  }
`;

class DrawPass extends React.Component {
  constructor(props) {
    super(props);
    const { slug } = props.match.params;

    this.state = {
      canvasImg: '',
      slug: slug,
    };
  }

  componentDidMount() {
    this.maybeOpenSession();
    this.maybeStartNewSession();
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
      slug: response.data.id,
    }, () => {
      this.props.history.push(`${this.props.location.pathname}/${this.state.slug}`);
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
    fetch(`/api/session_group/${this.state.slug}`, {
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
          slug={this.state.slug}
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

export default connect(mapStateToProps, mapDispatchToProps)(DrawPass);
