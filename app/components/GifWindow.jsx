import React from 'react';
import styled from 'styled-components';
import { Button } from './atoms';
import GIF from '../vendor/gif.js';

const Window = styled.div`
  margin-top: 1rem;

  @media (min-width: 900px) {
    left: 61.8rem;
    margin: 0;
    position: absolute;
    top: ${props => props.active ? '0.8rem' : props.topPos};
    transition: top 0.3s;
  }
`;

const CreateButton = styled(Button)`
  background-color: deeppink;
  bottom: 0.5rem;
  display: block;
  position: absolute;
  right: 0.5rem;

  @media (min-width: 900px) {
    bottom: initial;
    margin: 0 auto 0.5rem;
    position: relative;
    right: initial;
  }
`;

const CustomGif = styled.img`
  display: block;
  height: ${props => props.active ? props.height : 0};
  width: ${props => props.width};
`;

class GifWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = { active: false, windowTopPos: '-1.9rem' };
  }

  componentDidMount() {
  }

  activate() {
    this.setState({ active: true });
  }

  deactivate() {
    this.setState({ active: false });
  }

  resetGif() {
    this.gif = new GIF({
      background: '#fff',
      quality: 1,
      workers: 4,
      workerScript: './gif.worker.js',
      width: this.props.width,
      height: this.props.height,
    });

    this.gif.on('finished', blob => {
      this.customGif.src = URL.createObjectURL(blob);
      this.customGif.onload = () => {
        this.activate();
      };
    });
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

  peak() {
    if (this.state.active) return;

    this.setState({ windowTopPos: '0.8rem' });
  }

  unPeak() {
    if (this.state.active) return;

    this.setState({ windowTopPos: '-1.9rem' });
  }

  render() {
    return (
      <Window
        active={this.state.active}
        topPos={this.state.windowTopPos}
        onMouseEnter={() => this.peak()}
        onMouseLeave={() => this.unPeak()}
      >
        <CreateButton
          active={this.state.active}
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
