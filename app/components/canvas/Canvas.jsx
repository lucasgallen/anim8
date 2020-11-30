import React, { useEffect, useRef, useState } from 'react';

import { StyledCanvas } from './styles';

const DEFAULT_OP = 'source-out';

function Canvas(props) {
  const [isPenDown, setIsPenDown] = useState();
  const [canvasAction, setCanvasAction] = useState();
  const canvas = useRef(null);

  useEffect(() => {
    const ctx = canvas.current.getContext('2d');

    props.setCanvasContext(ctx);
    ctx.lineJoin = 'round';
    setIsPenDown(false);
  }, []);

  useEffect(() => {
    if (!props.canvasContext || !props.canvasImg) return;

    loadDrawing();
  }, [props.canvasContext, props.canvasImg]);

  useEffect(() => {
    if (!props.canvasContext) return;

    const op = canvasAction.globalCompositeOperation || DEFAULT_OP;
    props.canvasContext.globalCompositeOperation = op;

    canvasAction.action();
  }, [canvasAction]);

  const startPath = () => {
    const color = props.pen.color || '#000';
    const width = props.pen.width || 1;

    props.canvasContext.strokeStyle = color;
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

  const loadDrawing = () => {
    let img = new Image();

    img.onload = () => {
      props.canvasContext.clearRect(0, 0, canvas.current.width, canvas.current.height);
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
