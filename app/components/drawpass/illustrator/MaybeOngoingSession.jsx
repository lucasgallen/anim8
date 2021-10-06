import React from 'react';

import { Link } from '/app/components/styles/atoms';
import ResponseContainer from './ResponseContainer';
import Response from './Response';

export default function MaybeOngoingSession({ ongoing, slug, forceReady }) {
  if (!ongoing) return null;

  return (
    <ResponseContainer>
      <Response>
        Someone else is already drawing for this session ({ slug }).
      </Response>
      <Response>
        <Link
          onClick={ forceReady }
        >
          Draw anyway
        </Link>
        (This may lose contributions made by others)
      </Response>
    </ResponseContainer>
  );
}
