import React, { useState } from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
} from 'react-router-dom';
import { Helmet } from 'react-helmet';

import IllustratorSetup from './IllustratorSetup';
import NewSessionPrompt from './NewSessionPrompt';
import Tutorial from './tutorial/Tutorial';

import { Global } from '/app/components/styles/atoms';
import { Container, Title } from './styles/drawpass';

function DrawPassApp() {
  const [loading, setLoading] = useState(false);
  const [fetchFromSlug, setFetchFromSlug] = useState(true);

  const { path } = useRouteMatch();
  const history = useHistory();

  const toTutorial = step => {
    if (step > 0) {
      history.push(`${path}/tutorial/${step}`);
    } else {
      history.push(`${path}/tutorial`);
    }
  };

  const toSession = slug => {
    history.push(`${path}/${slug}`);
  };

  return (
    <Container>
      <Helmet>
        <title>Drawpass</title>
        <meta name="description" content="start a drawing to share with a friend and encourage them to contribute!"/>
      </Helmet>

      <Global backgroundColor='' />
      <Title><h1>drawpass</h1></Title>
      <Switch>
        <Route path={`${path}/tutorial/:step?`} render={({ path, match }) => (
          <Tutorial
            step={match.params.step || 0}
            path={path}
            setFetchFromSlug={setFetchFromSlug}
            setLoading={setLoading}
            toTutorial={toTutorial}
            toSession={toSession}
          />
        )} />
        <Route path={`${path}/:slug`} render={({ match }) => (
          <IllustratorSetup
            key={match.params.slug}
            fetchFromSlug={fetchFromSlug}
            setFetchFromSlug={setFetchFromSlug}
            slug={match.params.slug}
            loading={loading}
            setLoading={setLoading}
            toSession={toSession}
          />
        )} />
        <Route path={path}>
          <NewSessionPrompt
            loading={loading}
            setFetchFromSlug={setFetchFromSlug}
            setLoading={setLoading}
            toSession={toSession}
            toTutorial={toTutorial}
          />
        </Route>
      </Switch>
    </Container>
  );
}

export default DrawPassApp;
