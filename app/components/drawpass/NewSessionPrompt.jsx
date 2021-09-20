import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { setLoading } from '/app/actions/drawpass';

import NewSessionResponse from './NewSessionResponse';

import { Container, ContainerGrid, Copy, Button, Divider } from './styles/newSessionPrompt';
import useCreateSession from '/app/hooks/useCreateSession';

function NewSessionPrompt(props) {
  const [response, setResponse] = useState({ status: '' });
  const [id, setID] = useState();

  const handleCreate = useCreateSession(props.setLoading, ({ json, response }) => {
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
          loadingSession={props.loading}
          onClick={() => handleCreate()}
        >get drawing</Button>

        <Divider/>

        <Copy>nope . . .</Copy>
        <Button
          loadingSession={props.loading}
          onClick={props.toTutorial}
        >What is this?</Button>
      </ContainerGrid>
      <NewSessionResponse
        loading={props.loading}
        response={response}
      />
    </Container>
  );
}

const mapStateToProps = state => (
  {
    loading: state.loading
  }
);

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setLoading }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NewSessionPrompt);
