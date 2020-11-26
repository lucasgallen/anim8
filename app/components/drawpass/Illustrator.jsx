import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';

import { SaveButton, SaveContainer, SaveResponse } from './styles/illustrator';
import CanvasContainer from '../canvas/CanvasContainer';
import Loading from '/app/components/Loading';
import { LoadingContainer } from './styles/drawpass';

function Illustrator(props) {
  const [saveLabel, setSaveLabel] = useState('save image');
  const [isSaving, setIsSaving] = useState(false);
  const [canvasDims, setCanvasDims] = useState({});
  const [throttle, setThrottle] = useState(false);
  const [response, setResponse] = useState({ status: '', isOk: false });

  const canvasContainer = useRef(null);

  useEffect(() => {
    const label = isSaving ? 'saving image' : 'save image';
    setSaveLabel(label);
  }, [isSaving]);

  useEffect(() => {
    if (!canvasContainer || !canvasContainer.current) return;

    const container = canvasContainer.current.canvasContainerRef.current;
    if (!container) return;

    setCanvasDims({
      height: container.getBoundingClientRect().height,
      width: container.getBoundingClientRect().width,
    });

    window.addEventListener('resize', e => updateScreen(e));
  }, [props.loading]);

  const updateScreen = () => {
    if (throttle) return;

    const container = canvasContainer.current.canvasContainerRef.current;

    setThrottle(true);
    setTimeout(() => setThrottle(false), 500);

    setCanvasDims({
      height: container.getBoundingClientRect().height,
      width: container.getBoundingClientRect().width,
    });
  };

  const handleSaveResponse = res => {
    const message = responseMessage(res.status);

    setIsSaving(false);
    setResponse({ message: message, isOk: res.ok });

    return res.json();
  };

  const responseMessage = status => {
    switch (true) {
    case 200:
      return 'saved!';
    case 404:
      return 'error: either the session or image was not found';
    case +status >= 500:
      return 'error: something went wrong on the server. wait & try again';
    }
  };

  const getCanvasEl = element => {
    return element.getElementsByTagName('canvas')[0];
  };

  const saveImage = () => {
    const isOk = response.isOk;
    const canvas = getCanvasEl(canvasContainer.current.canvasContainerRef.current);
    const dataURL = canvas.toDataURL('image/png', 0.9);

    setIsSaving(true);
    setResponse({ message: '', isOk: isOk });

    fetch(`${process.env.API_SERVER}/api/shared_image/${props.slug}`, {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': `Token token=${process.env.API_TOKEN}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ data_url: dataURL }),
    }).then(response => handleSaveResponse(response));
  };

  const putCanvasContainer = () => {
    return (
      <CanvasContainer
        ref={canvasContainer}
        isSaving={isSaving}
        canvasImg={props.canvasImg}
        height={canvasDims.height}
        width={canvasDims.width}
        canFullscreen={true}
      />
    );
  };

  const putLoader = () => {
    return (
      <LoadingContainer>
        <Loading />
      </LoadingContainer>
    );
  };

  return (
    <>
      { props.loading ? putLoader() : putCanvasContainer() }
      <SaveContainer>
        <SaveButton
          isSaving={isSaving}
          onClick={() => saveImage()}
        >{saveLabel}</SaveButton>
        <SaveResponse error={!response.isOk} trigger={!isSaving}>{response.message}</SaveResponse>
      </SaveContainer>
    </>
  );
}

export default withRouter(Illustrator);
