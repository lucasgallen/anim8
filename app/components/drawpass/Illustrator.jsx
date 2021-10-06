import React, { useCallback, useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import { setIdle } from '/app/actions/drawpass';
import { setCanFullscreen } from '/app/actions/canvas';

import { readableNum } from '/app/helpers';
import useMinWait from '/app/hooks/useMinWait';
import useStateCallback from '/app/hooks/useStateCallback';

import CanvasContainer from '../canvas/CanvasContainer';
import DownloadDrawing from './DownloadDrawing';
import SaveResponse from '../SaveResponse';

import SaveButton from './SaveButton';

const MAX_IDLE_TIME_MS = readableNum('300_000');

function Illustrator(props) {
  const [canSave, setCanSave] = useState(false);
  const [saveLabel, setSaveLabel] = useState('save image');
  const [idleTimeout, setIdleTimeout] = useState();
  const [isSaving, setIsSaving] = useState(false);
  const [response, setResponse] = useState({ status: '', isOk: false });

  const [ , setDataURL] = useStateCallback('');

  useEffect(() => {
    props.setCanFullscreen(true);
  }, []);

  useEffect(() => (() => {
    clearTimeout(idleTimeout);
  }));

  useEffect(() => {
    const label = isSaving ? 'saving image' : 'save image';
    setSaveLabel(label);
  }, [isSaving]);

  useEffect(() => {
    const newTimeout = window.setTimeout(() => {
      props.setIdle(true);
    }, MAX_IDLE_TIME_MS);

    clearTimeout(idleTimeout);
    setIdleTimeout(newTimeout);
  }, [props.pen, props.colors, props.canvas]);

  const canvas = (
    document.getElementById(props.containerID) &&
    document.getElementById(props.containerID)
      .querySelector('canvas[data-shadow="false"]')
  );

  const saveImageFetch = dataURL => (
    fetch(`${process.env.API_SERVER}/api/shared_image/${props.slug}`, {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': `Token token=${process.env.API_TOKEN}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        colors: JSON.stringify({list: props.colors}),
        data_url: dataURL
      }),
    })
  );

  const minWaitSave = useMinWait(saveImageFetch);

  const handleSaveResponse = res => {
    const message = responseMessage(res.status);

    setIsSaving(false);
    setCanSave(false);
    setResponse({ message: message, isOk: res.ok });

    return res.json();
  };

  const responseMessage = status => {
    switch (true) {
    case +status === 200:
      return 'saved!';
    case +status === 404:
      return 'error: either the session or image was not found';
    case +status >= 500:
      return 'error: something went wrong on the server. wait & try again';
    }
  };

  const handleSaveImage = useCallback(() => {
    const isOk = response.isOk;
    const url = canvas.toDataURL('image/png', 0.9);

    setIsSaving(true);
    setResponse({ message: '', isOk: isOk });
    setDataURL(url, url => (
      minWaitSave(url).then(response => handleSaveResponse(response))
    ));
  }, [response.isOk, canvas]);

  const save = useCallback(() => (
    <SaveButton {...{
      canSave,
      handleSaveImage,
      isSaving,
      saveLabel
    }} />
  ), [canSave, handleSaveImage, isSaving, saveLabel]);

  const DownloadLink = useCallback(() => (
    <DownloadDrawing
      dataURL={canvas && canvas.toDataURL()}
      sessionID={props.slug}
    />
  ), [props.canvasContainerID, props.slug]);

  return (
    <>
      <Helmet>
        <title>Drawpass | { props.slug }</title>
      </Helmet>

      <SaveResponse
        response={response}
        isSaving={isSaving}
      />

      <CanvasContainer
        key={'drawpass'}
        isSaving={isSaving}
        background='white'
        canFullscreen={true}
        downloadLink={DownloadLink}
        save={save}
        setCanSave={setCanSave}
      />
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ setIdle, setCanFullscreen }, dispatch);
};

const mapStateToProps = state => (
  {
    canvas: state.canvas,
    colors: state.colors,
    containerID: state.ui.canvasContainerID,
    pen: state.pen,
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Illustrator);
