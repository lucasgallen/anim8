import React, { useEffect, useMemo, useRef, useState } from 'react';

import { StyledCanvas } from './styles';

const DEFAULT_OP = 'source-out';

function hexToRGB(hex) {
  if (!hex) return { red: 0, green: 0, blue: 0 };

  return {
    red: parseInt(hex.slice(0, 2), 16),
    green: parseInt(hex.slice(2, 4), 16),
    blue: parseInt(hex.slice(4, 6), 16)
  };
}

function Canvas(props) {
  const [isPenDown, setIsPenDown] = useState(false);
  const [canvasAction, setCanvasAction] = useState();
  const canvas = useRef(null);

  useEffect(() => {
    const ctx = canvas.current.getContext('2d');

    props.setCanvasContext(ctx);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  useEffect(() => {
    if (!props.canvasContext || !props.canvasImg) return;

    loadDrawing();
  }, [props.canvasImg]);

  useEffect(() => {
    if (!props.canvasContext) return;

    const op = canvasAction.globalCompositeOperation || DEFAULT_OP;
    props.canvasContext.globalCompositeOperation = op;

    canvasAction.action();
  }, [canvasAction]);


  const memoizedRGB = useMemo(() => hexToRGB(props.pen.color), [props.pen.color]);

  const startPath = () => {
    const alpha = props.pen.alpha || 1;
    const width = props.pen.width || 1;

    props.canvasContext.strokeStyle = `
      rgba(${memoizedRGB.red}, ${memoizedRGB.green}, ${memoizedRGB.blue}, ${alpha})
    `;
    props.canvasContext.lineWidth = width;
    props.canvasContext.beginPath();
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
    const positionRoot = e.touches ? e.touches[0] : e;
    const position = relativeMousePos(positionRoot);

    props.canvasContext.lineTo(position.x, position.y);
    props.canvasContext.stroke();

    props.canvasContext.beginPath();
    props.canvasContext.moveTo(position.x, position.y);
  };

  const eraseCircle = e => {
    const positionRoot = e.touches ? e.touches[0] : e;
    const position = relativeMousePos(positionRoot);

    props.canvasContext.beginPath();
    props.canvasContext.arc(position.x, position.y, props.pen.width, 0, Math.PI*2, true);
    props.canvasContext.closePath();
    props.canvasContext.fill();
  };


  const endPath = () => {
    if (props.drawDisabled) return;

    setCanvasAction({
      globalCompositeOperation: 'source-over',
      action: () => {
        props.canvasContext.closePath();
        setIsPenDown(false);
        props.pushCanvasState(canvas.current.toDataURL());
      },
    });
  };

  const setBackground = () => {
    props.canvasContext.fillStyle = props.background;
    props.canvasContext.fillRect(0, 0, canvas.current.width, canvas.current.height);
  };

  const loadDrawing = () => {
    let img = new Image();

    img.onload = () => {
      props.canvasContext.clearRect(0, 0, canvas.current.width, canvas.current.height);
      setBackground();
      props.canvasContext.drawImage(img, 0, 0);
    };

    img.setAttribute('src', props.canvasImg.replace(/\n|\r/g, ''));
  };

  const handlePointerDown = e => {
    if (props.drawDisabled) return;

    setIsPenDown(true);
    if (props.pen.isEraser) {
      setCanvasAction({
        globalCompositeOperation: 'destination-out',
        action: () => eraseCircle(e),
      });
    } else {
      setCanvasAction({
        globalCompositeOperation: 'source-over',
        action: () => startPath(),
      });
    }
  };

  const handlePointerMove = e => {
    if (!isPenDown) return;

    if (props.pen.isEraser) {
      eraseCircle(e);
    } else {
      drawPath(e);
    }
  };

  return (
    <StyledCanvas
      onMouseDown={e => handlePointerDown(e)}
      onTouchStart={e => handlePointerDown(e)}
      onMouseMove={e => handlePointerMove(e)}
      onTouchMove={e => handlePointerMove(e)}
      onMouseUp={() => endPath()}
      onTouchEnd={() => endPath()}
      background={props.background}
      left={props.position.left}
      top={props.position.top}
      width={props.width}
      height={props.height}
      ref={canvas}
    ></StyledCanvas>
  );
}

export default Canvas;
