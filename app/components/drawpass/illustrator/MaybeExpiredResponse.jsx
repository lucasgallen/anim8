import React from 'react';

import { Button } from '../styles/newSessionPrompt';
import ResponseContainer from './ResponseContainer';
import Response from './Response';

function MaybeExpiredResponse({ opened, sessionExpired, handleClick }) {
  if (!opened) return null;
  if (!sessionExpired) return null;

  return (
    <ResponseContainer>
      <Response>Sorry, your session has expired due to inactivity</Response>
      <Button
        loadingSession={false}
        onClick={handleClick}
      >start a new session</Button>
    </ResponseContainer>
  );
}

export default MaybeExpiredResponse;
