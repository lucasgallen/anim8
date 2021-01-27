import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import useMinWait from '/app/hooks/useMinWait';
import useStateCallback from '/app/hooks/useStateCallback';

import CanvasContainer from '../canvas/CanvasContainer';
import DownloadDrawing from './DownloadDrawing';
import SaveResponse from '../SaveResponse';

import { SaveButton } from './styles/illustrator';

function Illustrator(props) {
  const [canSave, setCanSave] = useState(false);
  const [saveLabel, setSaveLabel] = useState('save image');
  const [isSaving, setIsSaving] = useState(false);
  const [response, setResponse] = useState({ status: '', isOk: false });

  const [ , setDataURL] = useStateCallback('');

  useEffect(() => {
    const label = isSaving ? 'saving image' : 'save image';
    setSaveLabel(label);
  }, [isSaving]);

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

  const saveImage = canvas => {
    const isOk = response.isOk;
    const url = canvas.toDataURL('image/png', 0.9);

    setIsSaving(true);
    setResponse({ message: '', isOk: isOk });
    setDataURL(url, url => (
      minWaitSave(url).then(response => handleSaveResponse(response))
    ));
  };

  const Save = canvas => {
    return (
      <SaveButton
        disabled={canSave ? false : 'disabled'}
        isSaving={isSaving}
        onClick={() => saveImage(canvas)}
      >{saveLabel}</SaveButton>
    );
  };

  const DownloadLink = canvas => (
    <DownloadDrawing dataURL={canvas && canvas.toDataURL()} sessionID={props.slug} />
  );

  return (
    <>
      <SaveResponse
        response={response}
        isSaving={isSaving}
      />

      <CanvasContainer
        key={'drawpass'}
        isSaving={isSaving}
        background='white'
        canvasImg={props.canvasImg}
        canFullscreen={true}
        downloadLink={canvas => DownloadLink(canvas)}
        save={canvas => Save(canvas)}
        setCanSave={can => setCanSave(can)}
      />
    </>
  );
}

const mapStateToProps = state => ({ colors: state.colors });

export default connect(mapStateToProps)(Illustrator);
