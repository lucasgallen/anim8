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
};
