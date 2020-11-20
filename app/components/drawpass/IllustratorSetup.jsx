import React, { useState, useEffect } from 'react';

import Illustrator from './Illustrator';

import useOpenSession from '/app/hooks/useOpenSession';

function IllustratorSetup(props) {
  const [canvasImg, setCanvasImg] = useState('');
  
  const openSession = useOpenSession(props.slug, props.setLoading, (({ json }) => {
    const dataURL = json.data.relationships.shared_image.meta.data_url || '';

    setCanvasImg(dataURL);
  }));

  useEffect(() => {
    openSession();
  }, []);

  return (
    <Illustrator
      loading={props.loading}
      slug={props.slug}
      canvasImg={canvasImg}
      toggleScroll={props.toggleScroll}
    />
  );
}

export default IllustratorSetup;
