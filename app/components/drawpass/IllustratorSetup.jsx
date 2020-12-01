import React, { useState, useEffect } from 'react';

import Illustrator from './Illustrator';

import useOpenSession from '/app/hooks/useOpenSession';

const MIN_DATA_URL = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

function IllustratorSetup(props) {
  const [canvasImg, setCanvasImg] = useState(MIN_DATA_URL);
  const [opened, setOpened] = useState(false);
  
  const openSession = useOpenSession(props.slug, props.setLoading, (({ json }) => {
    const dataURL = json.data.relationships.shared_image.meta.data_url || '';

    if (!!dataURL && dataURL.length) {
      setCanvasImg(dataURL);
    }
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
