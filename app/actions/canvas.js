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

const setIsLocked = isLocked => (
  {
    type: 'SET_IS_LOCKED',
    payload: { isLocked: isLocked },
  }
);

export {
  setCanMove,
  setFullscreen,
  setIsLocked,
};
