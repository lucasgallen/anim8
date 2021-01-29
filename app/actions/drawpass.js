const addColor = colorData => (
  {
    type: 'ADD_COLOR',
    payload: colorData,
  }
);

const saveColors = colorsData => (
  {
    type: 'SAVE_COLORS',
    payload: colorsData,
  }
);

const saveCanvas = canvas => (
  {
    type: 'SAVE_CANVAS',
    payload: canvas,
  }
);

const savePen = penData => (
  {
    type: 'SAVE_PEN',
    payload: penData,
  }
);

export {
  addColor,
  saveColors,
  savePen,
  saveCanvas,
};
