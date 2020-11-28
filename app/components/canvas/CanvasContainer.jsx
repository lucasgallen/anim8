import React, { useEffect, useRef, useState } from 'react';

import { Container } from './styles';

import Canvas from './Canvas';
import CanvasUI from './ui/CanvasUI';
import ShadowCanvas from './ShadowCanvas';

const HEIGHT = 595;
const WIDTH = 842;

function CanvasContainer(props) {
  const [canMove, setCanMove]             = useState(true);
  const [canvasContext, setCanvasContext] = useState();
  const [canvasPos, setCanvasPos]         = useState({});
  const [drawDisabled, setDrawDisabled]   = useState(true);
  const [grabStartPos, setGrabStartPos]   = useState({});
  const [hasGrip, setHasGrip]             = useState(false);
  const [isFullscreen, setIsFullscreen]   = useState(false);
  const [pen, setPen]                     = useState({});
  const [positionLock, setPositionLock]   = useState(false);

  const canvasContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const shadowCanvas = useRef(null);

  useEffect(() => {
    setFullscreenHandler();
    centerCanvasPosition();

    return () => {
      unsetFullscreenHandler();
    };
  }, []);

  const canvas = () => {
    const container = canvasContainerRef.current;
    if (!container) return;

    return container.querySelector('canvas[data-shadow="false"]');
  };

  const updatePenColor = color => {
    const newPen = { ...pen, color: color };
    setPen(newPen);
  };

  const grabCanvas = e => {
    if (positionLock) return;
    if (!canMove) return;

    setHasGrip(true);
    setGrabStartPos(currentPosition(e));
  };

  const currentPosition = e => {
    const eventRoot = e.touches ? e.touches[0] : e;
    return { x: eventRoot.clientX, y: eventRoot.clientY };
  };

  const moveCanvas = e => {
    if (!hasGrip) return;

    const relPosition = relativeMousePos(e);
    const position = {
      x: canvasPos.left || 0,
      y: canvasPos.top || 0,
    };

    setGrabStartPos(currentPosition(e));
    setCanvasPos({
      left: relPosition.x + position.x,
      top: relPosition.y + position.y,
    });
  };

  const relativeMousePos = e => {
    const currentPos = currentPosition(e);

    return {
      x: currentPos.x - grabStartPos.x,
      y: currentPos.y - grabStartPos.y
    };
  };

  const release = () => {
    setHasGrip(false);
  };

  const openFullscreen = () => {
    const container = canvasContainerRef.current;
    container.requestFullscreen();
  };

  const exitFullscreen = () => {
    document.exitFullscreen();
  };

  const toggleFullscreen = () => {
    const fullscreenEl = document.fullscreenElement;

    if (fullscreenEl) {
      exitFullscreen();
    } else {
      openFullscreen();
    }
  };

  const setFullscreenHandler = () => {
    const container = canvasContainerRef.current;
    if (!container) return;

    container.onfullscreenchange = () => handleFullscreenChange();
  };

  const unsetFullscreenHandler = () => {
    const container = canvasContainerRef.current;
    if (!container) return;

    container.onfullscreenchange = null;
  };

  const handleFullscreenChange = () => {
    const fullscreenEl = document.fullscreenElement;
    if (fullscreenEl) {
      handleFullscreenStart();
    } else {
      handleFullscreenEnd();
    }

    // Call after fullscreen has set
    // TODO: find a way to 'know' when fullscreen is finished
    // (safari/ie don't provide promise functionality)
    setTimeout(() => centerCanvasPosition());
  };

  const centerCanvasPosition = () => {
    const container = canvasContainerRef.current;

    const left = (container.getBoundingClientRect().width - WIDTH) * 0.5;
    const top = (container.getBoundingClientRect().height - HEIGHT) * 0.5;

    setCanvasPos({
      left: left,
      top: top
    });
  };

  const handleFullscreenStart = () => {
    setIsFullscreen(true);
  };

  const handleFullscreenEnd = () => {
    setIsFullscreen(false);
    setPositionLock(false);
    setDrawDisabled(true);
  };

  const toggleLock = () => {
    const isLocked = positionLock;
    setPositionLock(!isLocked);
    setDrawDisabled(isLocked);
  };

  const menuOpts = () => {
    return {
      colorPickerParent: canvasContainerRef.current,
      isFullscreen: isFullscreen,
      updatePenColor: color => updatePenColor(color),
    };
  };

  const overlayOpts= () => {
    return {
      canClearCanvas: props.canClearCanvas,
      containerRef: canvasContainerRef,
      isFullscreen: isFullscreen,
      isLocked: positionLock,
      next: props.next,
      prev: props.prev,
      toggleLock: () => toggleLock(),
    };
  };

  return (
    <Container
      onMouseDown={e => grabCanvas(e)}
      onTouchStart={e => grabCanvas(e)}
      onMouseMove={e => moveCanvas(e)}
      onTouchMove={e => moveCanvas(e)}
      onMouseUp={() => release()}
      onTouchEnd={() => release()}
      ref={canvasContainerRef}
      isSaving={props.isSaving}
    >
      <Canvas
        background={props.shadowCanvas ? 'transparent' : 'white'}
        pen={pen}
        canvasImg={props.canvasImg}
        height={props.height || HEIGHT}
        width={props.width || WIDTH}
        ref={canvasRef}
        drawDisabled={drawDisabled}
        position={canvasPos}
        setCanvasContext={ctx => setCanvasContext(ctx)}
        canvasContext={canvasContext}
      />

      {
        props.shadowCanvas &&
        <ShadowCanvas
          canvasImg={props.shadowImg}
          height={props.height || HEIGHT}
          width={props.width || WIDTH}
          ref={shadowCanvas}
          position={canvasPos}
        />
      }

      <CanvasUI
        canFullscreen={props.canFullscreen}
        isFullscreen={isFullscreen}

        menuOpts={menuOpts()}
        overlayOpts={overlayOpts()}

        save={props.save(canvas())}
        setCanMove={canMove => setCanMove(canMove)}
        toggleFullscreen={() => toggleFullscreen()}
      />
    </Container>
  );
}

export default CanvasContainer;
