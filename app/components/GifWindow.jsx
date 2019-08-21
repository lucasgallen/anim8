import React from 'react';
import styled from 'styled-components';
import { Button } from './atoms';
import GIF from '../vendor/gif.js';

const Window = styled.div`
  position: absolute;
  right: 0.8rem;
  top: 0.8rem;
`;

const CreateButton = styled(Button)`
  background-color: deeppink;
  display: block;
  margin: 0 auto 1rem;
`;

const CustomGif = styled.img`
  display: block;
  height: ${props => props.active ? '30rem' : 0};
  width: 30rem;
`;

class GifWindow extends React.Component {
  constructor(props) {
    super(props);

    this.gif = new GIF({
      background: '#fff',
      quality: 1,
      workers: 4,
      workerScript: './gif.worker.js',
      width: 600,
      height: 600,
    });

    this.state = { active: false };
  }

  componentDidMount() {
    this.gif.on('finished', blob => {
      this.customGif.src = URL.createObjectURL(blob);
      this.customGif.onload = () => {
        this.activate();
      };
    });
  }

  activate() {
    this.setState({ active: true });
  }

  deactivate() {
    this.setState({ active: false });
  }

  resetGif() {
    this.gif.frames = [];
    this.gif.running = false;
  }

  createGif() {
    let imagePromises = [];

    this.resetGif();
    this.gif.running = false;

    this.props.pages.forEach((page) => {
      let image = new Image();
      const imagePromise = new Promise(res => {
        image.onload = () => {
          this.gif.addFrame(image, {delay: 1000});
          res();
        };
      });

      imagePromises.push(imagePromise);
      image.src = page.canvasImg;
    });

    Promise.all(imagePromises).then(() => this.gif.render());
  }

  render() {
    return (
      <Window>
        <CreateButton
          onClick={() => this.createGif()}
        >Create GIF</CreateButton>

        <CustomGif
          active={this.state.active}
          ref={(image) => this.customGif = image}
        />
      </Window>
    );
  }
}

export default GifWindow;
