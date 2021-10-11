import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setLoading } from '/app/actions/drawpass';

import NewSessionResponse from './NewSessionResponse';

import { Container, ContainerGrid, Copy, Button, Divider } from './styles/newSessionPrompt';
import useCreateSession from '/app/hooks/useCreateSession';

function NewSessionPrompt(props) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading);
  const [response, setResponse] = useState({ status: '' });
  const [id, setID] = useState();

  const dispatchSetLoading = useCallback((isLoading) => (
    dispatch(setLoading(isLoading))
  ), [dispatch]);

  const handleCreate = useCreateSession(dispatchSetLoading, ({ json, response }) => {
    if (!response || !json) return;

    if (json.data && json.data.id) {
      setID(json.data.id);
    }

    props.setFetchFromSlug(false);
    setResponse(response);
  });

  useEffect(() => {
    if (!id) return;
    props.toSession(id);
  }, [id]);

  return (
    <Container>
      <ContainerGrid>
        <Copy>Familiar?</Copy>
        <Button
          loadingSession={loading}
          onClick={() => handleCreate()}
        >get drawing</Button>

        <Divider/>

        <Copy>nope . . .</Copy>
        <Button
          loadingSession={loading}
          onClick={props.toTutorial}
        >What is this?</Button>
      </ContainerGrid>
      <NewSessionResponse
        loading={loading}
        response={response}
      />
    </Container>
  );
}

export default NewSessionPrompt;
