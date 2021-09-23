const setCanMove = canMove => (
  {
    type: 'SET_CAN_MOVE',
    payload: { canMove: canMove },
  }
);

const setDrawDisabled = drawDisabled => (
  {
    type: 'SET_DRAW_DISABLED',
    payload: { drawDisabled: drawDisabled },
  }
);

const setFullscreen = isFullscreen => (
  {
    type: 'SET_FULLSCREEN',
    payload: { fullscreen: isFullscreen },
  }
);

const setIsLocked = isLocked => (
  {
    type: 'SET_IS_LOCKED',
    payload: { isLocked: isLocked },
  }
);

export {
  setCanMove,
  setDrawDisabled,
  setFullscreen,
  setIsLocked,
};
