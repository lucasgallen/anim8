export const currentPosition = e => {
  const eventRoot = e.touches ? e.touches[0] : e;
  return { x: eventRoot.clientX, y: eventRoot.clientY };
};
