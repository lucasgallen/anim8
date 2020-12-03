import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Illustrator from './Illustrator';
import NewSessionResponse from './NewSessionResponse';
import Loading from '/app/components/Loading';

import useCreateSession from '/app/hooks/useCreateSession';
import useOpenSession from '/app/hooks/useOpenSession';

import { LoadingContainer } from './styles/drawpass';
import { Button } from './styles/newSessionPrompt';

const MIN_DATA_URL = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

const ResponseContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  font-size: 2.7rem;
  margin-top: 3rem;
`;

const Response = styled.span`
  margin-bottom: 2rem;
`;

function IllustratorSetup(props) {
  const [canvasImg, setCanvasImg] = useState(MIN_DATA_URL);
  const [id, setID] = useState();
  const [opened, setOpened] = useState(false);
  const [newSessionResponse, setNewSessionResponse] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  const openSession = useOpenSession(
    props.slug,
    props.setLoading,
    ({ json, res }) => handleOpenSession({ json, res }),
  );

  useEffect(() => {
    if (props.fetchFromSlug) {
      openSession();
    } else {
      setOpened(true);
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    props.toSession(id);
  }, [id]);

  const createSession = useCreateSession(props.setLoading, ({ json, response }) => {
    if (!response || !json) return;

    if (json.data && json.data.id) {
      setID(json.data.id);
    }

    props.setFetchFromSlug(false);
    setNewSessionResponse(response);
  });

  const handleClick = () => {
    setOpened(false);
    setSessionExpired(false);

    createSession();
  };

  const handleMissingSession = res => {
    if (res.ok) return false;
    if (res.status !== 404) return false;

    setSessionExpired(true);
    setOpened(true);
    return true;
  };

  const handleOpenSession = ({ json, res }) => {
    if (handleMissingSession(res)) return;

    const dataURL = json.data.relationships.shared_image.meta.data_url || '';

    if (!!dataURL && dataURL.length) {
      setCanvasImg(dataURL);
    }
    setOpened(true);
  };

  const maybeMountExpiredResponse = () => {
    if (!opened) return;
    if (!sessionExpired) return;

    return (
      <ResponseContainer>
        <Response>Sorry, your session has expired due to inactivity</Response>
        <Button
          loadingSession={props.loading}
          onClick={() => handleClick()}
        >start a new session</Button>
      </ResponseContainer>
    );
  };

  const maybeMountIllustrator = () => {
    if (!opened) return;
    if (sessionExpired) return;

    return (
      <Illustrator
        slug={props.slug}
        canvasImg={canvasImg}
        toggleScroll={props.toggleScroll}
        openFullscreen={props.openFullscreen}
      />
    );
  };

  const maybeMountNewSessionResponse = () => {
    if (!opened) return;
    if (sessionExpired) return;
    if (props.loading) return;
    if (!newSessionResponse) return;

    return (
      <NewSessionResponse
        loading={props.loading}
        response={newSessionResponse}
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
      { props.loading && putLoader() }
      { maybeMountExpiredResponse() }
      { maybeMountIllustrator() }
      { maybeMountNewSessionResponse() }
    </>
  );
}

export default IllustratorSetup;
