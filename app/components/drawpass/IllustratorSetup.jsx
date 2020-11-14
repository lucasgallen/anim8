import React, { useState } from 'react';

import Illustrator from './Illustrator';

import useOpenSession from '/app/hooks/useOpenSession';

function IllustratorSetup(props) {
  const [canvasImg, setCanvasImg] = useState('');

  const openSession = useOpenSession(props.slug, props.setLoading, (({ json }) => {
    if (!json) return;
    const dataURL = json.data.relationships.shared_image.meta.data_url || '';

    setCanvasImg(dataURL);
  }));

  return (
    <Illustrator
      loading={props.loading}
      slug={props.slug}
      canvasImg={canvasImg}
      openSession={openSession}
    />
  );
}

export default IllustratorSetup;
