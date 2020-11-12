import React from 'react';

import { SaveButton, SaveContainer, SaveResponse } from './styles/illustrator';
import CanvasContainer from '../canvas/CanvasContainer';

class Illustrator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      canvasDims: {},
      pen: {},
      colors: [],
      colorCardsActive: false,
      isSaving: false,
      saveResponse: '',
      isResponseOk: true,
    };
  }

  componentDidMount() {
    let canvasContainer;

    this.canvasContainerRef = this.canvasContainer.canvasContainerRef;
    canvasContainer = this.canvasContainerRef;

    this.setState({
      canvasDims: {
        height: canvasContainer.getBoundingClientRect().height,
        width: canvasContainer.getBoundingClientRect().width,
      }
    }, () => {
      window.addEventListener('resize', e => this.updateScreen(e));
    });
  }

  updateScreen() {
    const canvasContainer = this.canvasContainerRef;
    if (this.throttle) return;

    this.throttle = true;
    setTimeout(() => { this.throttle = false; }, 500);

    this.setState({
      canvasDims: {
        height: canvasContainer.getBoundingClientRect().height,
        width: canvasContainer.getBoundingClientRect().width,
      }
    });
  }

  handleSaveResponse(res) {
    const message = this.responseMessage(res.status);
    this.setState({ isSaving: false, saveResponse: message, isResponseOk: res.ok });
    return res.json();
  }

  responseMessage(status) {
    switch (true) {
    case 200:
      return 'saved!';
    case 404:
      return 'error: either the session or image was not found';
    case +status >= 500:
      return 'error: something went wrong on the server. wait & try again';
    }
  }

  saveImage() {
    const canvas = this.canvasContainer.canvasRef.current.canvas;
    const dataURL = canvas.toDataURL('image/png', 0.9);

    this.setState({ isSaving: true, saveResponse: '' });

    fetch(`/api/shared_image/${this.props.slug}`, {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': `Token token=${process.env.API_TOKEN}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ data_url: dataURL }),
    }).then(response => this.handleSaveResponse(response));
  }

  render() {
    const saveCopy = this.state.isSaving ? 'saving image' : 'save image';

    return (
      <div>
        <CanvasContainer
          ref={ref => this.canvasContainer = ref}
          isSaving={this.state.isSaving}
          canvasImg={this.props.canvasImg}
          height={this.state.canvasDims.height}
          width={this.state.canvasDims.width}
        />
        <SaveContainer>
          <SaveButton
            isSaving={this.state.isSaving}
            onClick={() => this.saveImage()}
          >{saveCopy}</SaveButton>
          <SaveResponse error={!this.state.isResponseOk} trigger={!this.state.isSaving}>{this.state.saveResponse}</SaveResponse>
        </SaveContainer>
      </div>
    );
  }
}

export default Illustrator;
