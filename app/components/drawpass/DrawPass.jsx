import React, { useEffect, useState } from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
} from 'react-router-dom';

import IllustratorSetup from './IllustratorSetup';
import NewSessionPrompt from './NewSessionPrompt';
import Tutorial from './Tutorial';

import useContainerSlide from '/app/hooks/useContainerSlide';

import { Container, Title } from './styles/drawpass';

function DrawPassApp() {
  const [slide, setSlide] = useState({});
  const [loading, setLoading] = useState(false);

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

  const containerSlide = useContainerSlide(path);

  useEffect(() => {
    setSlide(containerSlide());
  }, [history]);

  return (
    <Container
      start={slide.start}
      end={slide.end}
    >
      <Title><h1>drawpass</h1></Title>
      <Switch>
        <Route path={`${path}/tutorial/:step?`} render={({ path, match }) => (
          <Tutorial
            key={match.params.step || 0}
            step={match.params.step || 0}
            path={path}
            setLoading={setLoading}
            toTutorial={toTutorial}
            toSession={toSession}
          />
        )} />
        <Route path={`${path}/:slug`} render={({ match }) => (
          <IllustratorSetup
            slug={match.params.slug}
            loading={loading}
            setLoading={setLoading}
          />
        )} />
        <Route path={path}>
          <NewSessionPrompt
            loading={loading}
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
