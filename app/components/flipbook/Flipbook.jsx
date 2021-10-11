import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';

import {
  Container,
  FlipbookContainer,
  TitleContainer,
} from './styled/index';

import NextButton from './NextButton';
import PrevButton from './PrevButton';

import {
  addPage,
  savePage,
} from '../../actions/flipbook.js';

import {
  setCanFullscreen,
  setCanClear,
  setDataURL,
} from '/app/actions/canvas.js';

import { Global } from '../styles/atoms';
import CanvasContainer from '../canvas/CanvasContainer';
import GifWindow from './GifWindow';
import Title from './Title';

function Flipbook(props) {
  const dispatch = useDispatch();
  const {
    pages,
    containerID,
  } = useSelector(state => ({
    pages: state.pages,
    containerID: state.ui.canvasContainerID,
  }));

  const [pageNumber, setPageNumber] = useState(1);
  const [canvasDims, setCanvasDims] = useState({ height: 1, width: 1 });
  const [gifReady, setGifReady] = useState(false);

  useEffect(() => {
    dispatch(setCanFullscreen(true));
    dispatch(setCanClear(true));
  }, []);

  useEffect(() => {
    const currentPage = pages[pageNumber - 1];
    const newDataURL = currentPage ? currentPage.dataURL : '';
    dispatch(setDataURL(newDataURL));
  }, [pageNumber, pages]);

  const canvasEl = (
    document.getElementById(containerID) &&
    document.getElementById(containerID)
      .querySelector('canvas[data-shadow="false"]')
  );

  const prevButtonDisabled = pageNumber <= 1;

  const dispatchAddPage = () => {
    const currentDataURL = canvasEl.toDataURL();
    setGifReady(true);
    dispatch(addPage({ dataURL: currentDataURL, pageIndex: pageNumber }));
  };

  const clearPage = () => {
    let shadowCanvas = canvasEl.parentElement.querySelector('canvas[data-shadow="true"]');
    let ctx = canvasEl.getContext('2d');
    let shadowCtx = shadowCanvas.getContext('2d');

    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    shadowCtx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  };

  const dispatchSavePage = () => {
    const currentDataURL = canvasEl.toDataURL();

    dispatch(savePage({
      dataURL: currentDataURL,
      pageIndex: pageNumber - 1
    }));
  };

  const nextPage = () => {
    if (pageNumber - 1 === pages.length) {
      dispatchAddPage();
    }

    dispatchSavePage();
    clearPage();

    setPageNumber((pageNumber) => pageNumber + 1);
  };

  const prevPage = () => {
    if (pageNumber <= 1) return;

    clearPage();
    setPageNumber((pageNumber) => pageNumber - 1);
  };

  const shadowDataURL = useMemo(() => {
    if (!pages.length) return;
    if (pageNumber - 2 < 0) return;

    return pages[pageNumber - 2].dataURL;
  }, [pageNumber, pages]);

  return (
    <Container>
      <Helmet>
        <title>Flipbook</title>
        <meta name="description" content="Create your own hand-crafted animated gif" />
      </Helmet>

      <Global backgroundColor='' />
      <TitleContainer>
        <Title />
      </TitleContainer>
      <FlipbookContainer>
        <CanvasContainer
          key={'flipbook'}
          page={pageNumber}
          next={() => <NextButton nextPage={nextPage} />}
          prev={() => <PrevButton disabled={prevButtonDisabled} prevPage={prevPage} />}
          shadowDataURL={shadowDataURL}
          shadowCanvas
          background='white'
          setCanvasDims={dims => setCanvasDims({ canvasDims: dims })}
        />
      </FlipbookContainer>

      <GifWindow
        height={canvasDims.height}
        width={canvasDims.width}
        store={props.store}
        pages={pages}
        ready={gifReady}
      />
    </Container>
  );
}

export default Flipbook;
