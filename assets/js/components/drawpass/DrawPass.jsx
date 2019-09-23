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
  margin: -10rem auto 0;
  max-width: 55rem;
  position: relative;
  transform: ${props => props.transform};
  transition: transform 0.25s cubic;
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

  containerSlide() {
    let slide = { start: '0', end: '50%' };

    switch (this.props.stage) {
      case TUTORIAL_STAGE:
        slide.end = '5rem';
        slide.start = '50%';
    }

    return slide;
  }

  render() {
    let transform = '';
    const slide = this.containerSlide();

    if (this.props.stage !== TUTORIAL_STAGE) {
      transform = 'translateY(-50%)';
    }

    return (
      <Container
        start={slide.start}
        end={slide.end}
        transform={transform}
      >
        <Title><h1>drawpass</h1></Title>
        {this.drawPassStage()}
      </Container>
    );
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
