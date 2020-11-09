import React from 'react';
import styled from 'styled-components';
import { Button, Label, Input } from '../styles/atoms';
import GIF from 'gif';

// Gif delay in ms
const MIN_DELAY = 20;
const MAX_DELAY = 5000;

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
  box-shadow: ${props => props.active ? '1px 1px 2px 1px #00000017' : ''};
  display: block;
  margin: 0 auto;
  margin-bottom: ${props => props.active ? '0.5rem' : '0'};
`;

const UI = styled.div`
  background: cornsilk;
  border: 2px solid black;
  display: block;
  margin-top: 0.5rem;
  max-width: calc(100% - 4px);
  padding: 1rem 0;
`;

class GifWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      windowTopPos: '-1.9rem',
      delay: 300,
      needsRefresh: false,
    };
  }

  activate() {
    this.setState({
      active: true,
      needsRefresh: false,
    });
  }

  deactivate() {
    this.setState({ active: false });
  }

  resetGif() {
    this.gif = new GIF({
      background: '#fff',
      quality: 1,
      workers: 4,
      workerScript: '/gif.worker.js',
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
          this.gif.addFrame(image, { delay: this.state.delay });
          res();
        };
      });

      imagePromises.push(imagePromise);
      image.src = page.canvasImg;
    });

    Promise.all(imagePromises).then(() => this.gif.render());
  }

  handleUIChange(e) {
    const uiValue = e.currentTarget.value;
    this.setState({ delay: uiValue, needsRefresh: this.state.active });
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
        >
          { this.state.needsRefresh ? 'recreate gif' : 'create gif' }
        </CreateButton>

        <UI>
          <Label>delay</Label>
          <Input
            type='range' min={MIN_DELAY} max={MAX_DELAY} step='100'
            onChange={e => this.handleUIChange(e)}
            value={ this.state.delay }
            width={'20rem'}
          />
          <span style={{ fontSize: '1.5rem' }}>{ `${this.state.delay / 1000}s` }</span>
        </UI>
      </Window>
    );
  }
}

export default GifWindow;
