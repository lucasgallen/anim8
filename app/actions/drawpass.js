export const NEW_STAGE       = 'new';
export const DRAW_STAGE      = 'draw';
export const TUTORIAL_STAGE  = 'tutorial';

export const changeStage = stageData => (
  {
    type: 'CHANGE_DRAWPASS_STAGE',
    payload: stageData,
  }
);
