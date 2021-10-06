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

const setDataURL = dataURL => (
  {
    type: 'SET_DATA_URL',
    payload: dataURL,
  }
);

const setIdle = idle => (
  {
    type: 'SET_IDLE',
    payload: idle,
  }
);

const setLoading = loading => (
  {
    type: 'SET_LOADING',
    payload: loading,
  }
);

export {
  addColor,
  saveColors,
  savePen,
  saveCanvas,
  setDataURL,
  setIdle,
  setLoading,
};
