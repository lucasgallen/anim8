import React from 'react';

import Illustrator from '../Illustrator';

export default function MaybeIllustrator({ opened, sessionExpired, idle, slug, openFullscreen }) {
  if (!opened) return null;
  if (sessionExpired) return null;
  if (idle) return null;

  return (
    <Illustrator
      slug={slug}
      openFullscreen={openFullscreen}
    />
  );
}
