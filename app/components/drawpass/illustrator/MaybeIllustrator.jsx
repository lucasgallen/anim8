import React from 'react';

import Illustrator from '../Illustrator';

export default function maybeMountIllustrator({ opened, sessionExpired, idle, slug, dataURL, toggleScroll, openFullscreen, makeIdle }) {
  if (!opened) return null;
  if (sessionExpired) return null;
  if (idle) return null;

  return (
    <Illustrator
      slug={slug}
      dataURL={dataURL}
      toggleScroll={toggleScroll}
      openFullscreen={openFullscreen}
      setIdle={makeIdle}
    />
  );
}
