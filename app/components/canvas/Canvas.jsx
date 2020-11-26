import React, { useEffect, useRef, useState } from 'react';

import { StyledCanvas } from './styles';

const Canvas = React.forwardRef((props, ref) => {
  const [canvasContext, setCanvasContext] = useState();
  const [isPenDown, setIsPenDown] = useState();
  const canvas = useRef(ref);

  useEffect(() => {
    setCanvasContext(canvas.current.getContext('2d'));
    setIsPenDown(false);
  }, []);

  useEffect(() => {
    if (!canvasContext || !props.canvasImg) return;

    loadDrawing();
  }, [canvasContext, props.canvasImg]);

  const startPath = () => {
    const color = props.pen.color || '#000';
    if (props.drawDisabled) return;

    canvasContext.strokeStyle = color;
    canvasContext.beginPath();
    setIsPenDown(true);
  };

  const relativeMousePos = e => {
    let rect = canvas.current.getBoundingClientRect();

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const drawPath = e => {
    if (!isPenDown) return;

    let mousePos = relativeMousePos(e);

    canvasContext.lineTo(mousePos.x, mousePos.y);
    canvasContext.stroke();
  };

  const drawTouchPath = e => {
    let touchPos;

    if (e.touches.length > 1) return;
    if (!isPenDown) return;

    touchPos = relativeMousePos(e.touches[0]);
    canvasContext.lineTo(touchPos.x, touchPos.y);
    canvasContext.stroke();
  };

  const endPath = () => {
    if (props.drawDisabled) return;

    setIsPenDown(false);
  };

  const loadDrawing = () => {
    let img = new Image();

    img.onload = () => {
      canvasContext.drawImage(img, 0, 0);
    };

    img.setAttribute('src', props.canvasImg.replace(/\n|\r/g, ''));
  };

  return (
    <StyledCanvas
      onMouseDown={() => startPath()}
      onTouchStart={() => startPath()}
      onMouseMove={(e) => drawPath(e)}
      onTouchMove={(e) => drawTouchPath(e)}
      onMouseUp={() => endPath()}
      onTouchEnd={() => endPath()}
      background={props.background}
      left={props.position.left}
      top={props.position.top}
      width={842}
      height={595}
      ref={canvas}
    ></StyledCanvas>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;
