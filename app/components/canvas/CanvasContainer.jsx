import React, { useEffect, useRef, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { saveCanvas } from '/app/actions/drawpass';

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
  const [dataURL, setDataURL]             = useState(null);
  const [isFullscreen, setIsFullscreen]   = useState(false);
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
    props.saveCanvas({ index: 0, dataURLs: [props.dataURL] });
  }, [props.dataURL]);

  useEffect(() => {
    if (fromReset.current) {
      fromReset.current = false;
      setDataURL(props.dataURL);
    } else {
      setDataURL(props.canvas.dataURLs[props.canvas.index]);
    }
  }, [props.canvas.index, props.dataURL]);

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

  const maybeSliceCanvasURLs = () => {
    const urls = [...props.canvas.dataURLs];

    return urls.slice(0, props.canvas.index + 1);
  };

  const pushCanvasURL = dataURL => {
    const slicedURLs = maybeSliceCanvasURLs();
    const newURLs = [...slicedURLs, dataURL];
    const newState = { ...props.canvas, index: newURLs.length - 1, dataURLs: newURLs };

    props.saveCanvas(newState);
  };

  const redo = () => {
    const newIndex = props.canvas.index + 1;
    const newState = { ...props.canvas, index: newIndex };

    props.saveCanvas(newState);
  };

  const undo = () => {
    const newIndex = props.canvas.index - 1;
    const newState = { ...props.canvas, index: newIndex };

    props.saveCanvas(newState);
  };

  return (
    <Container
      hasGrip={hasGrip}
      onMouseDown={e => grabCanvas(e)}
      onTouchStart={e => grabCanvas(e)}
      onMouseMove={e => moveCanvas(e)}
      onTouchMove={e => moveCanvas(e)}
      onMouseUp={() => release()}
      onTouchEnd={() => release()}
      locked={positionLock}
      ref={canvasContainerRef}
      isSaving={props.isSaving}
    >
      <Canvas
        background={props.shadowCanvas ? 'transparent' : props.background}
        setCanSave={props.setCanSave}
        canvasDataURL={dataURL}
        height={props.height || HEIGHT}
        width={props.width || WIDTH}
        drawDisabled={drawDisabled}
        position={canvasPos}
        setCanvasContext={setCanvasContext}
        canvasContext={canvasContext}
        pushCanvasState={pushCanvasURL}
      />

      {
        props.shadowCanvas &&
        <ShadowCanvas
          canvasDataURL={props.shadowDataURL}
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
          }}

          overlayOpts={{
            canClearCanvas: props.canClearCanvas,
            containerRef: canvasContainerRef,
            currentCanvasIndex: {
              current: props.canvas.index,
              max: props.canvas.dataURLs.length - 1
            },
            isFullscreen: isFullscreen,
            isLocked: positionLock,
            next: props.next,
            prev: props.prev,
            redo: redo,
            toggleLock: toggleLock,
            undo: undo,
          }}

          save={props.save && props.save(canvas())}
          setCanMove={setCanMove}
          toggleFullscreen={toggleFullscreen}
        />
      }
    </Container>
  );
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ saveCanvas }, dispatch);
};

const mapStateToProps = state => (
  {
    canvas: state.canvas
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CanvasContainer);
