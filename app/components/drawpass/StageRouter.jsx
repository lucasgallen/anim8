import React from 'react';

import Illustrator from './Illustrator';
import NewSessionPrompt from './NewSessionPrompt';
import Tutorial from './Tutorial';
import Loading from '../Loading';

import { LoadingContainer } from './styles/drawpass';

import { NEW_STAGE, DRAW_STAGE, TUTORIAL_STAGE } from '../../actions/drawpass.js';

const StageRouter = props => {
  return (() => {
    switch (props.stage) {
    case NEW_STAGE:
      return (
        <NewSessionPrompt
          loading={props.loadingNewSession}
          createNewSession={props.createNewSession}
        />
      );
    case DRAW_STAGE:
      return (
        <Illustrator
          slug={props.match.params.slug}
          canvasImg={props.canvasImg}
        />
      );
    case TUTORIAL_STAGE:
      return (
        <Tutorial
          createNewSession={props.createNewSession}
        />
      );
    default:
      return (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      );
    }
  })();
};

export default StageRouter;
