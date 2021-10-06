import React from 'react';

import NewSessionResponse from '../NewSessionResponse';

export default function MaybeNewSessionResponse({ opened, sessionExpired, loading, newSessionResponse }) {
  if (!opened) return null;
  if (sessionExpired) return null;
  if (loading) return null;
  if (!newSessionResponse) return null;

  return (
    <NewSessionResponse
      loading={loading}
      response={newSessionResponse}
    />
  );
}
