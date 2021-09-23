const setCanMove = canMove => (
  {
    type: 'SET_CAN_MOVE',
    payload: { canMove: canMove },
  }
);

const setFullscreen = isFullscreen => (
  {
    type: 'SET_FULLSCREEN',
    payload: { fullscreen: isFullscreen },
  }
);

export {
  setCanMove,
  setFullscreen,
};