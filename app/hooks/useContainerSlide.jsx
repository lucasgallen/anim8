function useContainerSlide(path = '') {
  let slide = { start: '0', end: 'calc(50vh - 50%)' };

  return (() => {
    switch (path) {
    case path.includes('tutorial'):
      slide.end = '5rem';
      slide.start = 'calc(50vh - 50%)';
      return slide;
    case path.includes('drawpass/'):
      slide.end = '5rem';
      slide.start = 'calc(50vh - 50%)';
      return slide;
    default:
      return slide;
    }
  });
}

export default useContainerSlide;
