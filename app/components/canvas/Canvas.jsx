import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';

import { hexToRGB } from '/app/helpers';
import useStateCallback from '/app/hooks/useStateCallback';

import { StyledCanvas } from './styles';

const DEFAULT_OP = 'source-over';

function Canvas(props) {
  const [isPenDown, setIsPenDown] = useState(false);
  const [ , setGlobalCompositeOp] = useStateCallback([DEFAULT_OP, '']);
  const canvas = useRef(null);
  const firstLoad = useRef(true);

  useEffect(() => {
    const ctx = canvas.current.getContext('2d');

    props.setCanvasContext(ctx);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  useEffect(() => {
    if (!props.canvasContext || !props.canvasDataURL) return;

    if (!firstLoad.current && props.setCanSave) props.setCanSave(true);
    loadDrawing();
  }, [props.canvasDataURL]);

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

  const drawPath = e => {
    const position = relativePosition(e);

    props.canvasContext.lineTo(position.x, position.y);
    props.canvasContext.stroke();

    props.canvasContext.beginPath();
    props.canvasContext.moveTo(position.x, position.y);
  };

  const endPath = () => {
    if (props.drawDisabled) return;

    setGlobalCompositeOp(['', 'endPath'], () => {
      if (!props.canvasContext) return;

      setIsPenDown(false);
      props.canvasContext.strokeStyle = 'transparent';
      props.canvasContext.globalCompositeOperation = DEFAULT_OP;

      props.pushCanvasState(canvas.current.toDataURL());
    });
  };

  const eraseCircle = e => {
    const position = relativePosition(e);

    props.canvasContext.beginPath();
    props.canvasContext.arc(position.x, position.y, props.pen.width, 0, Math.PI*2, true);
    props.canvasContext.closePath();
    props.canvasContext.fill();
  };

  const relativePosition = e => {
    const positionRoot = e.touches ? e.touches[0] : e;
    const rect = canvas.current.getBoundingClientRect();

    return {
      x: positionRoot.clientX - rect.left,
      y: positionRoot.clientY - rect.top
    };
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

    img.setAttribute('src', props.canvasDataURL.replace(/\n|\r/g, ''));
    firstLoad.current = false;
  };

  const handlePointerDown = e => {
    if (props.drawDisabled) return;

    setIsPenDown(true);
    if (props.pen.isEraser) {
      setGlobalCompositeOp(['destination-out', 'handlePointerDown'], ([globalComp, ]) => {
        if (!props.canvasContext) return;

        props.canvasContext.globalCompositeOperation = globalComp;
        eraseCircle(e);
      });
    } else {
      setGlobalCompositeOp(['source-over', 'handlePointerDown'], ([globalComp, ]) => {
        if (!props.canvasContext) return;

        props.canvasContext.globalCompositeOperation = globalComp;
        startPath();
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
      left={props.canvasPosition.left}
      top={props.canvasPosition.top}
      width={props.width}
      height={props.height}
      ref={canvas}
    ></StyledCanvas>
  );
}

const mapStateToProps = state => {
  return {
    canvasPosition: state.ui.canvasPosition,
    drawDisabled: state.ui.drawDisabled,
    pen: state.pen,
  };
};

export default connect(mapStateToProps)(Canvas);
