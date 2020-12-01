import React, { useEffect, useRef, useState } from 'react';

import { Container } from './styles';

import Canvas from './Canvas';
import CanvasUI from './ui/CanvasUI';
import ShadowCanvas from './ShadowCanvas';

const DEFAULT_PEN_WIDTH = 3;
const HEIGHT = 595;
const WIDTH = 842;

function CanvasContainer(props) {
  const [canMove, setCanMove]             = useState(true);
  const [canvasContext, setCanvasContext] = useState();
  const [canvasState, setCanvasState]     = useState({ index: 0, images: [props.canvasImg] });
  const [canvasPos, setCanvasPos]         = useState({});
  const [drawDisabled, setDrawDisabled]   = useState(true);
  const [grabStartPos, setGrabStartPos]   = useState({});
  const [hasGrip, setHasGrip]             = useState(false);
  const [img, setImg]                     = useState(null);
  const [isFullscreen, setIsFullscreen]   = useState(false);
  const [pen, setPen]                     = useState({ width: DEFAULT_PEN_WIDTH });
  const [positionLock, setPositionLock]   = useState(false);

  const canvasContainerRef = useRef(null);
  const fromReset = useRef(false);

  useEffect(() => {
    maybeSetCanvasSize();
    setFullscreenHandler();
    centerCanvasPosition();

    return () => {
      unsetFullscreenHandler();
    };
  }, []);

  useEffect(() => {
    fromReset.current = true;
    setCanvasState({ index: 0, images: [props.canvasImg] });
  }, [props.canvasImg]);

  useEffect(() => {
    if (fromReset.current) {
      fromReset.current = false;
      setImg(props.canvasImg);
    } else {
      setImg(canvasState.images[canvasState.index]);
    }
  }, [canvasState.index, props.canvasImg]);

  const canvas = () => {
    const container = canvasContainerRef.current;
    if (!container) return;

    return container.querySelector('canvas[data-shadow="false"]');
  };

  const maybeSetCanvasSize = () => {
    const canvasEl = canvas();
    if (!props.setCanvasDims) return;

    props.setCanvasDims({
      height: canvasEl.height,
      width: canvasEl.width,
    });
  };

  const updatePenColor = ({ color, alpha }) => {
    const newPen = { ...pen, color: color, alpha: alpha };
    setPen(newPen);
  };

  const updatePenWidth = width => {
    const newPen = { ...pen, width: width };
    setPen(newPen);
  };

  const setPenEraser = isEraser => {
    const newPen = { ...pen, isEraser: isEraser };
    setPen(newPen);
  };

  const grabCanvas = e => {
    if (positionLock) return;
    if (!canMove) return;
    if (e.target.nodeName !== 'CANVAS') return;

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

  const maybeSliceCanvasImages = () => {
    const images = [...canvasState.images];

    return images.slice(0, canvasState.index + 1);
  };

  const pushCanvasImg = img => {
    const slicedImages = maybeSliceCanvasImages();
    const newImages = [...slicedImages, img];
    const newState = { ...canvasState, index: newImages.length - 1, images: newImages };

    setCanvasState(newState);
  };

  const redo = () => {
    const newIndex = canvasState.index + 1;
    const newState = { ...canvasState, index: newIndex };

    setCanvasState(newState);
  };

  const undo = () => {
    const newIndex = canvasState.index - 1;
    const newState = { ...canvasState, index: newIndex };

    setCanvasState(newState);
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
        background={props.shadowCanvas ? 'transparent' : props.background}
        pen={pen}
        canvasImg={img}
        height={props.height || HEIGHT}
        width={props.width || WIDTH}
        drawDisabled={drawDisabled}
        position={canvasPos}
        setCanvasContext={ctx => setCanvasContext(ctx)}
        canvasContext={canvasContext}
        pushCanvasState={image => pushCanvasImg(image)}
      />

      {
        props.shadowCanvas &&
        <ShadowCanvas
          canvasImg={props.shadowImg}
          height={props.height || HEIGHT}
          width={props.width || WIDTH}
          position={canvasPos}
        />
      }

      { !hasGrip &&
        <CanvasUI
          canFullscreen={props.canFullscreen}
          downloadLink={props.downloadLink && props.downloadLink(canvas())}
          isFullscreen={isFullscreen}

          menuOpts={{
            colorPickerParent: canvasContainerRef.current,
            isFullscreen: isFullscreen,
            setPenEraser: isEraser => setPenEraser(isEraser),
            updatePenColor: ({ color, alpha }) => updatePenColor({ color, alpha }),
            updatePenWidth: width => updatePenWidth(width),
          }}

          overlayOpts={{
            canClearCanvas: props.canClearCanvas,
            containerRef: canvasContainerRef,
            currentCanvasIndex: {
              current: canvasState.index,
              max: canvasState.images.length - 1
            },
            isFullscreen: isFullscreen,
            isLocked: positionLock,
            next: props.next,
            prev: props.prev,
            redo: () => redo(),
            toggleLock: () => toggleLock(),
            undo: () => undo(),
          }}

          save={props.save && props.save(canvas())}
          setCanMove={canMove => setCanMove(canMove)}
          toggleFullscreen={() => toggleFullscreen()}
        />
      }
    </Container>
  );
}

export default CanvasContainer;
