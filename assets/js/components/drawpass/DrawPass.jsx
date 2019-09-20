import React from 'react';

import Illustrator from './Illustrator';
import NewSessionPrompt from './NewSessionPrompt';

class DrawPass extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        newSession: false,
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
      newSession: false,
      slug: data.slug,
      canvasImg: data.shared_image.blob || ''
    });
  }

  maybeStartNewSession() {
    if (this.props.sessionId !== 'new') return;

    this.setState({
      newSession: true
    });
  }

  maybeOpenSession() {
    if (this.props.sessionId === 'new') return;
    // TODO: request session by slug
  }

  // TODO: select UI based on drawpass "stage"
  // TODO: use select..case
  render() {
    return (
      <div>
        {
          !this.state.newSession &&
          <Illustrator
            canvasImg={this.state.canvasImg}
          />
        }
        {
          this.state.newSession &&
          <NewSessionPrompt
            createNewSession={() => this.createNewSession()}
          />
        }
        {/*
        TODO: make connect to session component
        */}
      </div>
    );
  }
}

export default DrawPass;
