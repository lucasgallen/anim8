import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { msToMin } from '/app/helpers';
import Loading from '/app/components/Loading';

import { saveColors, setLoading } from '/app/actions/drawpass.js';
import { setDataURL } from '/app/actions/canvas.js';
import useCreateSession from '/app/hooks/useCreateSession';
import useOpenSession from '/app/hooks/useOpenSession';

import { LoadingContainer } from './styles/drawpass';

import MaybeExpiredResponse from './illustrator/MaybeExpiredResponse';
import MaybeIdleResponse from './illustrator/MaybeIdleResponse';
import MaybeIllustrator from './illustrator/MaybeIllustrator';
import MaybeOngoingSession from './illustrator/MaybeOngoingSession';
import MaybeNewSessionResponse from './illustrator/MaybeNewSessionResponse';

const MAX_UPDATE_AGE_MINUTES = 60;

function IllustratorSetup(props) {
  const dispatch = useDispatch();
  const {
    idle,
    loading,
  } = useSelector(state => ({
    idle: state.idle,
    loading: state.loading
  }));

  const [id, setID] = useState();
  const [ongoing, setOngoing] = useState(false);
  const [opened, setOpened] = useState(false);
  const [newSessionResponse, setNewSessionResponse] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  const dispatchSetLoading = useCallback(isLoading => (
    dispatch(setLoading(isLoading))
  ), [dispatch]);

  const openSession = useOpenSession(
    props.slug,
    dispatchSetLoading,
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

  const createSession = useCreateSession(dispatchSetLoading, ({ json, response }) => {
    if (!response || !json) return;

    if (json.data && json.data.id) {
      setID(json.data.id);
    }

    props.setFetchFromSlug(false);
    setNewSessionResponse(response);
  });

  const handleCreateSession = () => {
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
      dispatch(setDataURL(dataURL));
    }
    if (colorList.list) {
      dispatch(saveColors(colorList.list));
    }
    setOpened(true);
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
      { loading && putLoader() }
      <MaybeExpiredResponse
        {
          ...{
            handleCreateSession,
            loading,
            opened,
            sessionExpired,
          }
        }
      />
      <MaybeIdleResponse {
        ...{
          idle,
          refresh,
        }
      } />
      <MaybeOngoingSession {
        ...{
          forceReady,
          ongoing,
          slug: props.slug,
        }
      } />
      <MaybeIllustrator
        {
          ...{
            idle,
            opened,
            sessionExpired,
            slug: props.slug,
          }
        }
      />
      <MaybeNewSessionResponse
        {
          ...{
            loading,
            opened,
            newSessionResponse,
            sessionExpired,
          }
        }
      />
    </>
  );
}

export default IllustratorSetup;
