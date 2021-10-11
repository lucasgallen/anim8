import React from 'react';
import styled from 'styled-components';

import GifWindow from './GifWindow';

const UIContainer = styled.div`
  margin-top: 4rem;

  @media (min-width: 900px) {
    float: right;
    margin: 0;
    max-width: calc(50% - 0.5rem);
    width: 70rem;
  }
`;

const UI = styled.div`
  background: cornsilk;
  border: 2px solid black;
  display: block;
  height: 30rem;
  margin-top: 1rem;
  width: calc(100% - 4px);
`;

class GifUI extends React.Component {
  constructor(props) {
    super(props);

    this.state = { active: false, };
  }

  componentDidMount() {
  }

  dynamicWindowHeight() {
    if (!this.props.active) return 0;

    return Math.floor(this.props.windowHeight);
  }

  render() {
    const windowWidth = this.propsWindowWidth || 0;

    return (
      <UIContainer>
        <GifWindow
          height={this.dynamicWindowHeight()}
          width={windowWidth}
          pages={this.props.pages}
          active={this.state.active}
        />

        <UI>{'huh?'}</UI>
      </UIContainer>
    );
  }
}

export default GifUI;
