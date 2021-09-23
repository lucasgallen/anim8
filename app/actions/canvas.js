const setCanMove = canMove => (
  {
    type: 'SET_CAN_MOVE',
    payload: { canMove: canMove },
  }
);

export {
  setCanMove,
};
