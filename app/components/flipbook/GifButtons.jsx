import React from 'react';
import styled from 'styled-components';

import { Button } from '../styles/atoms';

const Container = styled.div`
  display: flex;
  justify-content: space-around;
`;

const CreateButton = styled(Button)`
  background-color: deeppink;
  display: inline-block;
`;

const DownloadButton = styled(Button)`
  ${props => props.disabled.length ? `
    cursor: default;
    filter: opacity(0.5);
    pointer-events: none;
  ` : '' }
`;

function Buttons(props) {
  const createCopy = () => {
    if (props.isLoading) return 'Loading';
    if (props.needsRefresh) return 'recreate gif';
    return 'create gif';
  };

  return (
    <Container>
      <CreateButton
        active={props.active}
        disabled={props.ready ? '' : 'disabled'}
        onClick={props.createGif}
      >
        { createCopy() }
      </CreateButton>

      <DownloadButton as='a'
        disabled={props.gif && props.gif.src.length ? '' : 'disabled'}
        href={props.gif ? props.gif.src : ''}
        download={'flipbook.gif'}
      >
        Download
      </DownloadButton>
    </Container>
  );
}

export default Buttons;
