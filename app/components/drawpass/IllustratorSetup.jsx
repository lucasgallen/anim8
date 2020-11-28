import React, { useState, useEffect } from 'react';

import Illustrator from './Illustrator';

import useOpenSession from '/app/hooks/useOpenSession';

function IllustratorSetup(props) {
  const [canvasImg, setCanvasImg] = useState('');
  const [opened, setOpened] = useState(false);
  
  const openSession = useOpenSession(props.slug, props.setLoading, (({ json }) => {
    const dataURL = json.data.relationships.shared_image.meta.data_url || '';

    setCanvasImg(dataURL);
  }));

  useEffect(() => {
    openSession();
    setOpened(true);
  }, []);

  return (
    <>
      {
        opened &&
        <Illustrator
          loading={props.loading}
          slug={props.slug}
          canvasImg={canvasImg}
          toggleScroll={props.toggleScroll}
          openFullscreen={props.openFullscreen}
        />
      }
    </>
  );
}

export default IllustratorSetup;
