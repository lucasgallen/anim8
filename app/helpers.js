const hexToRGB = hex => {
  if (!hex) return { red: 0, green: 0, blue: 0 };

  return {
    red: parseInt(hex.slice(0, 2), 16),
    green: parseInt(hex.slice(2, 4), 16),
    blue: parseInt(hex.slice(4, 6), 16)
  };
};

const rgbaColor = color => {
  if (!color || !color.color) return 'rgba(0,0,0,1)';
  const rgb = hexToRGB(color.color);
  const alpha = color.alpha || 1;
  return `rgba(${rgb.red},${rgb.green},${rgb.blue},${alpha})`;
};

export {
  hexToRGB,
  rgbaColor,
};
