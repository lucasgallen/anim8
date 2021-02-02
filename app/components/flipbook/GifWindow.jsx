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
`;

const CustomGif = styled.img`
  border: none;
  box-shadow: ${props => props.active ? '1px 1px 2px 1px #00000017' : ''};
  display: ${props => props.hide ? 'none' : 'block'};
  height: auto;
  margin: 0 auto;
  margin-bottom: ${props => props.active ? '0.5rem' : '0'};
  width: calc(100% - 10rem);
`;

const UI = styled.div`
  background: cornsilk;
  border: 2px solid black;
  display: block;
  margin-top: 0.5rem;
  max-width: calc(100% - 4px);
  padding: 1rem 0;
`;

const Loading = styled.div`
  font-size: 3rem;
  margin: 0 auto;
  text-align: center;
  text-transform: uppercase;
  width: calc(100% - 10rem);

  p {
    height: 0;
    padding: 35.5% 0;
  }
`;

class GifWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      delay: 300,
      isLoading: false,
      needsRefresh: false,
      windowTopPos: '-1.9rem',
    };
  }

  activate() {
    this.setState({
      active: true,
      isLoading: false,
      needsRefresh: false,
    });
  }

  deactivate() {
    this.setState({ active: false });
  }

  startLoading() {
    this.setState({ isLoading: true });
  }

  resetGif() {
    this.gif = new GIF({
      background: '#fff',
      height: this.props.height,
      quality: 1,
      width: this.props.width,
      workers: 4,
      workerScript: '/gif.worker.js',
    });

    this.startLoading();

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
      image.src = page.dataURL;
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

  createButtonCopy() {
    if (this.state.isLoading) return 'Loading';
    if (this.state.needsRefresh) return 'recreate gif';
    return 'create gif';
  }

  render() {
    return (
      <Window
        active={this.state.active}
      >
        { this.state.isLoading && <Loading><p>loading</p></Loading> }
        <CustomGif
          active={this.state.active}
          hide={this.state.isLoading}
          ref={(image) => this.customGif = image}
        />

        <CreateButton
          active={this.state.active}
          disabled={this.props.ready ? '' : 'disabled'}
          onClick={() => this.createGif()}
        >
          { this.createButtonCopy() }
        </CreateButton>

        <UI>
          <Label>delay</Label>
          <Input
            onChange={e => this.handleUIChange(e)}
            type='range' min={MIN_DELAY} max={MAX_DELAY} step='100'
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
