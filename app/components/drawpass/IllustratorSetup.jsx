import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { msToMin } from '/app/helpers';
import Loading from '/app/components/Loading';

import { saveColors, setDataURL, setLoading } from '/app/actions/drawpass.js';
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
  const [id, setID] = useState();
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
    if (!props.idle) return;

    readySession();
  }, [props.idle]);

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
      props.setDataURL(dataURL);
    }
    if (colorList.list) {
      props.saveColors(colorList.list);
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
      { props.loading && putLoader() }
      <MaybeExpiredResponse
        {
          ...{
            opened, sessionExpired, handleClick,
            loading: props.loading
          }
        }
      />
      <MaybeIdleResponse {
        ...{
          idle: props.idle,
          refresh
        }
      } />
      <MaybeOngoingSession { ...{ ongoing, slug: props.slug, forceReady }} />
      <MaybeIllustrator
        {
          ...{
            opened, sessionExpired,
            idle: props.idle,
            slug: props.slug,
            openFullscreen: props.openFullscreen
          }
        }
      />
      <MaybeNewSessionResponse
        {
          ...{
            opened, sessionExpired, newSessionResponse,
            loading: props.loading
          }
        }
      />
    </>
  );
}

const mapStateToProps = state => (
  {
    idle: state.idle,
    loading: state.loading
  }
);

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ saveColors, setDataURL, setLoading }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(IllustratorSetup);
