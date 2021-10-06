import React from 'react';

import { Link } from '/app/components/styles/atoms';
import ResponseContainer from './ResponseContainer';
import Response from './Response';

export default function MaybeIdleResponse({ idle, refresh }) {
  if (!idle) return null;

  return (
    <ResponseContainer>
      <Response>
        This session has gone idle.
        <Link
          onClick={refresh}
        >
          Refresh
        </Link>
        the page to continue.
      </Response>
    </ResponseContainer>
  );
}
