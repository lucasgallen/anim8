import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { hexToRGB } from '/app/helpers';
import useStateCallback from '/app/hooks/useStateCallback';

import { StyledCanvas } from './styles';

const DEFAULT_OP = 'source-over';

function Canvas(props) {
  const {
    canvasPosition,
    drawDisabled,
    pen,
  } = useSelector(state => ({
    canvasPosition: state.ui.canvasPosition,
    drawDisabled: state.ui.drawDisabled,
    pen: state.pen,
  }));

  const [canvasContext, setCanvasContext] = useState();
  const [isPenDown, setIsPenDown] = useState(false);
  const [ , setGlobalCompositeOp] = useStateCallback([DEFAULT_OP, '']);
  const canvas = useRef(null);
  const firstLoad = useRef(true);

  useEffect(() => {
    const ctx = canvas.current.getContext('2d');

    setCanvasContext(ctx);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  useEffect(() => {
    if (!canvasContext || !props.canvasDataURL) return;

    if (!firstLoad.current && props.setCanSave) props.setCanSave(true);
    loadDrawing();
  }, [props.canvasDataURL]);

  const memoizedRGB = useMemo(() => hexToRGB(pen.color), [pen.color]);

  const startPath = useCallback(() => {
    const alpha = pen.alpha || 1;
    const width = pen.width || 1;

    canvasContext.strokeStyle = `
      rgba(${memoizedRGB.red}, ${memoizedRGB.green}, ${memoizedRGB.blue}, ${alpha})
    `;
    canvasContext.lineWidth = width;
    canvasContext.beginPath();
    setIsPenDown(true);
  }, [pen.alpha, pen.width, memoizedRGB, canvasContext]);

  const drawPath = e => {
    const position = relativePosition(e);

    canvasContext.lineTo(position.x, position.y);
    canvasContext.stroke();

    canvasContext.beginPath();
    canvasContext.moveTo(position.x, position.y);
  };

  const endPath = () => {
    if (drawDisabled) return;

    setGlobalCompositeOp(['', 'endPath'], () => {
      if (!canvasContext) return;

      setIsPenDown(false);
      canvasContext.strokeStyle = 'transparent';
      canvasContext.globalCompositeOperation = DEFAULT_OP;

      props.pushCanvasState(canvas.current.toDataURL());
    });
  };

  const eraseCircle = useCallback((e) => {
    const position = relativePosition(e);

    canvasContext.beginPath();
    canvasContext.arc(position.x, position.y, pen.width, 0, Math.PI*2, true);
    canvasContext.closePath();
    canvasContext.fill();
  }, [canvasContext]);

  const relativePosition = e => {
    const positionRoot = e.touches ? e.touches[0] : e;
    const rect = canvas.current.getBoundingClientRect();

    return {
      x: positionRoot.clientX - rect.left,
      y: positionRoot.clientY - rect.top
    };
  };

  const setBackground = () => {
    canvasContext.fillStyle = props.background;
    canvasContext.fillRect(0, 0, canvas.current.width, canvas.current.height);
  };

  const loadDrawing = () => {
    let img = new Image();

    img.onload = () => {
      canvasContext.clearRect(0, 0, canvas.current.width, canvas.current.height);
      setBackground();
      canvasContext.drawImage(img, 0, 0);
    };

    img.setAttribute('src', props.canvasDataURL.replace(/\n|\r/g, ''));
    firstLoad.current = false;
  };

  const handlePointerDown = useCallback((e) => {
    if (drawDisabled) return;

    setIsPenDown(true);
    if (pen.isEraser) {
      setGlobalCompositeOp(['destination-out', 'handlePointerDown'], ([globalComp, ]) => {
        if (!canvasContext) return;

        canvasContext.globalCompositeOperation = globalComp;
        eraseCircle(e);
      });
    } else {
      setGlobalCompositeOp(['source-over', 'handlePointerDown'], ([globalComp, ]) => {
        if (!canvasContext) return;

        canvasContext.globalCompositeOperation = globalComp;
        startPath();
      });
    }
  }, [drawDisabled, pen.isEraser, canvasContext, startPath, eraseCircle]);

  const handlePointerMove = useCallback((e) => {
    if (!isPenDown) return;

    if (pen.isEraser) {
      eraseCircle(e);
    } else {
      drawPath(e);
    }
  }, [isPenDown, pen.isEraser, eraseCircle, drawPath]);

  return (
    <StyledCanvas
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
      onMouseUp={endPath}
      onTouchEnd={endPath}
      background={props.background}
      left={canvasPosition.left}
      top={canvasPosition.top}
      width={props.width}
      height={props.height}
      ref={canvas}
    ></StyledCanvas>
  );
}

export default Canvas;
