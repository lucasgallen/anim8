import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { msToMin } from '/app/helpers';
import Illustrator from './Illustrator';
import NewSessionResponse from './NewSessionResponse';
import Loading from '/app/components/Loading';

import { saveColors } from '/app/actions/drawpass.js';
import useCreateSession from '/app/hooks/useCreateSession';
import useOpenSession from '/app/hooks/useOpenSession';

import { Link } from '/app/components/styles/atoms';
import { LoadingContainer } from './styles/drawpass';
import { Button } from './styles/newSessionPrompt';

const MAX_UPDATE_AGE_MINUTES = 60;
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
  const [idle, setIdle] = useState(false);
  const [ongoing, setOngoing] = useState(false);
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

  useEffect(() => {
    if (!idle) return;

    readySession();
  }, [idle]);

  const forceReady = () => {
    readySession().then(() => refresh());
  };

  const readySession = () => (
    fetch(`${process.env.API_SERVER}/api/session_group/${props.slug}`, {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': `Token token=${process.env.API_TOKEN}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        image_ready: true
      }),
    })
  );

  const refresh = e => {
    if (e) e.preventDefault();
    window.location.reload();
  };

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


  const handleOngoingSession = data => {
    const lastUpdate = data.attributes.updated_at;
    const lastUpdateMinutesAgo = msToMin(Date.now() - Date.parse(lastUpdate));

    if (lastUpdateMinutesAgo > MAX_UPDATE_AGE_MINUTES) return false;
    if (data.attributes.image_ready) return false;

    setOngoing(true);
    return true;
  };

  const handleOpenSession = ({ json, res }) => {
    if (handleMissingSession(res)) return;
    if (handleOngoingSession(json.data)) return;

    handleReadySession(json.data);
  };

  const handleReadySession = data => {
    const dataURL = data.relationships.shared_image.meta.data_url || '';
    const colorList = JSON.parse(data.relationships.shared_image.meta.colors) || {};

    if (!!dataURL && dataURL.length) {
      setCanvasImg(dataURL);
    }
    if (colorList.list) {
      props.saveColors(colorList.list);
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
    if (idle) return;

    return (
      <Illustrator
        slug={props.slug}
        canvasImg={canvasImg}
        toggleScroll={props.toggleScroll}
        openFullscreen={props.openFullscreen}
        setIdle={() => setIdle(true)}
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

  const maybeMountIdleResponse = () => {
    if (!idle) return;

    return (
      <ResponseContainer>
        <Response>
          This session has gone idle.
          <Link
            onClick={e => refresh(e)}
          >
            Refresh
          </Link>
          the page to continue.
        </Response>
      </ResponseContainer>
    );
  };

  const maybeMountOngoingSession = () => {
    if (!ongoing) return;

    return (
      <ResponseContainer>
        <Response>
          Someone else is already drawing for this session ({props.slug}).
        </Response>
        <Response>
          <Link
            onClick={() => forceReady()}
          >
            Draw anyway
          </Link>
          (This may lose contributions made by others)
        </Response>
      </ResponseContainer>
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
      { maybeMountIdleResponse() }
      { maybeMountOngoingSession() }
      { maybeMountIllustrator() }
      { maybeMountNewSessionResponse() }
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ saveColors }, dispatch);
};

export default connect(null, mapDispatchToProps)(IllustratorSetup);
