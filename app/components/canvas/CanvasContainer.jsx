import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import useMaybeNullComponent from '/app/hooks/useMaybeNullComponent';

import { currentPosition } from '/app/lib/helpers';
import { saveCanvas } from '/app/actions/drawpass';
import {
  setCanvasPosition,
  setFullscreen,
  setIsLocked,
  setDrawDisabled
} from '/app/actions/canvas';

import { Container } from './styles';

import Canvas from './Canvas';
import CanvasUI from './ui/CanvasUI';
import ShadowCanvas from './ShadowCanvas';

const HEIGHT = 595;
const WIDTH = 842;

function CanvasContainer(props) {
  const dispatch = useDispatch();
  const {
    canvas,
    inheritedDataURL,
    ui,
  } = useSelector(state => ({
    canvas: state.canvas,
    inheritedDataURL: state.dataURL,
    ui: state.ui,
  }));

  const [grabStartPos, setGrabStartPos]   = useState({});
  const [hasGrip, setHasGrip]             = useState(false);
  const [dataURL, setDataURL]             = useState(null);

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
    dispatch(saveCanvas({ index: 0, dataURLs: [inheritedDataURL] }));
  }, [inheritedDataURL, props.page]);

  useEffect(() => {
    if (fromReset.current) {
      fromReset.current = false;
      setDataURL(inheritedDataURL);
    } else {
      setDataURL(canvas.dataURLs[canvas.index]);
    }
  }, [canvas.index, inheritedDataURL]);

  const downloadLink = useMaybeNullComponent(props.downloadLink);
  const next = useMaybeNullComponent(props.next);
  const prev = useMaybeNullComponent(props.prev);
  const save = useMaybeNullComponent(props.save);

  const getCanvasEl = () => {
    const container = canvasContainerRef.current;
    if (!container) return;

    return container.querySelector('canvas[data-shadow="false"]');
  };

  const maybeSetCanvasSize = () => {
    const canvasEl = getCanvasEl();
    if (!props.setCanvasDims) return;

    props.setCanvasDims({
      height: canvasEl.height,
      width: canvasEl.width,
    });
  };

  const grabCanvas = e => {
    if (ui.isLocked) return;
    if (!ui.canMove) return;
    if (e.target.nodeName !== 'CANVAS') return;

    setHasGrip(true);
    setGrabStartPos(currentPosition(e));
  };

  const moveCanvas = e => {
    if (!hasGrip) return;

    const relPosition = relativeMousePos(e);
    const position = {
      x: ui.canvasPosition.left || 0,
      y: ui.canvasPosition.top || 0,
    };

    setGrabStartPos(currentPosition(e));
    dispatch(setCanvasPosition({
      left: relPosition.x + position.x,
      top: relPosition.y + position.y,
    }));
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

    dispatch(setCanvasPosition({
      left: left,
      top: top
    }));
  };

  const handleFullscreenStart = () => {
    dispatch(setFullscreen(true));
  };

  const handleFullscreenEnd = () => {
    dispatch(setFullscreen(false));
    dispatch(setIsLocked(false));
    dispatch(setDrawDisabled(true));
  };

  const maybeSliceCanvasURLs = () => {
    const urls = [...canvas.dataURLs];

    return urls.slice(0, canvas.index + 1);
  };

  const pushCanvasURL = dataURL => {
    const slicedURLs = maybeSliceCanvasURLs();
    const newURLs = [...slicedURLs, dataURL];
    const newState = { ...canvas, index: newURLs.length - 1, dataURLs: newURLs };

    dispatch(saveCanvas(newState));
  };

  return (
    <Container id={ui.canvasContainerID}
      hasGrip={hasGrip}
      onMouseDown={e => grabCanvas(e)}
      onTouchStart={e => grabCanvas(e)}
      onMouseMove={e => moveCanvas(e)}
      onTouchMove={e => moveCanvas(e)}
      onMouseUp={() => release()}
      onTouchEnd={() => release()}
      locked={ui.isLocked}
      ref={canvasContainerRef}
      isSaving={props.isSaving}
    >
      <Canvas
        background={props.shadowCanvas ? 'transparent' : props.background}
        setCanSave={props.setCanSave}
        canvasDataURL={dataURL}
        height={props.height || HEIGHT}
        width={props.width || WIDTH}
        pushCanvasState={pushCanvasURL}
      />

      {
        props.shadowCanvas &&
        <ShadowCanvas
          canvasDataURL={props.shadowDataURL}
          height={props.height || HEIGHT}
          width={props.width || WIDTH}
        />
      }

      <CanvasUI
        downloadLink={downloadLink}
        next={next}
        prev={prev}
        save={save}
      />
    </Container>
  );
}

export default CanvasContainer;
