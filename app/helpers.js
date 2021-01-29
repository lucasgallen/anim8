const hexToRGB = hex => {
  if (!hex) return { red: 0, green: 0, blue: 0 };
  if (hex.length > 6) return { red: 0, green: 0, blue: 0 };
  if (hex.length % 3 !== 0) return { red: 0, green: 0, blue: 0 };

  const increment = hex.length === 6 ? 2 : 1;

  return {
    red: parseInt(hex.slice(0, increment * 1), 16),
    green: parseInt(hex.slice(increment*1, increment*2), 16),
    blue: parseInt(hex.slice(increment*2, increment*3), 16)
  };
};

const rgbaColor = color => {
  if (!color || !color.color) return 'rgba(0,0,0,1)';
  const rgb = hexToRGB(color.color);
  const alpha = color.alpha || 1;
  return `rgba(${rgb.red},${rgb.green},${rgb.blue},${alpha})`;
};

const msToMin = ms => {
  return secToMin(msToSec(ms));
};

const msToSec = ms => ms/1000;

const readableNum = string => Number.parseInt(string.replaceAll('_', ''));

const secToMin = sec => sec/60;

export {
  hexToRGB,
  msToMin,
  readableNum,
  rgbaColor,
};
