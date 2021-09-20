export const savePage = (state, action) => {
  let pages = JSON.parse(JSON.stringify(state.pages));

  pages[action.payload.pageIndex] = {
    dataURL: action.payload.dataURL,
  };

  return pages;
};
