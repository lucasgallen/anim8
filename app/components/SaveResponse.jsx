import React, { useState } from 'react';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { fadeAway } from '/app/components/styles/keyframes';
import { Button } from '/app/components/styles/atoms';

const CopyButton = styled(Button)`
  align-items: center;
  display: flex;
  position: relative;

  :after {
    color: black;
    content: attr(data-message);
    font-weight: bold;
    left: calc(100% + 1rem);
    opacity: ${props => props.showCopied ? '1' : '0'};
    position: absolute;
    transition: opacity 0.3s ease-in-out;
  }
`;

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const Response = styled.span`
  animation-name: ${props => props.trigger ? fadeAway : ''};
  animation-delay: 3s;
  animation-duration: 3s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  color: ${props => props.error ? 'red' : 'green'};
  display: inline-block;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  width: 100%;
`;

const SHOW_COPIED_MS = 2000;

function SaveResponse(props) {
  const [showCopied, setShowCopied] = useState(false);

  const handleCopy = () => {
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), SHOW_COPIED_MS);
  };

  return (
    <Container>
      <Response
        error={!props.response.isOk}
        trigger={!props.isSaving}
      >
        {props.response.message}
      </Response>
      { 
        props.response.isOk &&
        <CopyToClipboard
          text={window.location.href}
          onCopy={() => handleCopy()}
        >
          <CopyButton showCopied={showCopied} data-message={'link copied!'}>copy drawpass link</CopyButton>
        </CopyToClipboard>
      }
    </Container>
  );
}

export default SaveResponse;
