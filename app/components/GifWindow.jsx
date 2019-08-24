import React from 'react';
import styled from 'styled-components';
import { Button } from './atoms';
import GIF from '../vendor/gif.js';

const Window = styled.div`
  margin-top: 4rem;

  @media (min-width: 900px) {
    float: right;
    margin: 0;
    margin-top: ${props => props.active ? '0' : props.topPos};
    max-width: calc(50% - 0.5rem);
    transition: margin-top 0.3s, height 0.3s;
    width: 70rem;
  }
`;

const CreateButton = styled(Button)`
  background-color: deeppink;
  margin: 0 auto;
  display: block;

  @media (min-width: 900px) {
  }
`;

const CustomGif = styled.img`
  border: none;
  display: block;
  margin: 0 auto;
  margin-bottom: ${props => props.active ? '0.5rem' : '0'};
`;

class GifWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = { active: false, windowTopPos: '-1.9rem' };
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

  dynamicHeight() {
    if (!this.state.active) return 0;

    return Math.floor(this.props.height);
  }

  render() {
    const width = Math.floor(this.props.width) || 0;

    return (
      <Window
        active={this.state.active}
        topPos={this.state.windowTopPos}
        onMouseEnter={() => this.peak()}
        onMouseLeave={() => this.unPeak()}
      >
        <CustomGif
          active={this.state.active}
          ref={(image) => this.customGif = image}
          width={width}
          height={this.dynamicHeight()}
        />

        <CreateButton
          active={this.state.active}
          onClick={() => this.createGif()}
        >Create GIF</CreateButton>
      </Window>
    );
  }
}

export default GifWindow;
