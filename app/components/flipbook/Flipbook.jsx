import React, { useEffect, useMemo, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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
  updateScreen
} from '../../actions/flipbook.js';

import {
  setCanFullscreen,
  setCanClear,
  setDataURL,
} from '/app/actions/canvas.js';

import { saveColors } from '/app/actions/drawpass.js';
import { Global } from '../styles/atoms';
import CanvasContainer from '../canvas/CanvasContainer';
import GifWindow from './GifWindow';
import Title from './Title';

function Flipbook(props) {
  const [pageNumber, setPageNumber] = useState(1);
  const [canvasDims, setCanvasDims] = useState({ height: 1, width: 1 });
  const [gifReady, setGifReady] = useState(false);

  useEffect(() => {
    props.setCanFullscreen(true);
    props.setCanClear(true);
  }, []);

  useEffect(() => {
    const currentPage = props.pages[pageNumber - 1];
    const newDataURL = currentPage ? currentPage.dataURL : '';
    props.setDataURL(newDataURL);
  }, [pageNumber, props.pages]);

  const canvasEl = (
    document.getElementById(props.containerID) &&
    document.getElementById(props.containerID)
      .querySelector('canvas[data-shadow="false"]')
  );

  const prevButtonDisabled = pageNumber <= 1;

  const addPage = () => {
    const currentDataURL = canvasEl.toDataURL();
    setGifReady(true);
    props.addPage({ dataURL: currentDataURL, pageIndex: pageNumber });
  };

  const clearPage = () => {
    let shadowCanvas = canvasEl.parentElement.querySelector('canvas[data-shadow="true"]');
    let ctx = canvasEl.getContext('2d');
    let shadowCtx = shadowCanvas.getContext('2d');

    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    shadowCtx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  };

  const savePage = () => {
    const currentDataURL = canvasEl.toDataURL();

    props.savePage({
      dataURL: currentDataURL,
      pageIndex: pageNumber - 1
    });
  };

  const nextPage = () => {
    if (pageNumber - 1 === props.pages.length) {
      addPage();
    }

    savePage();
    clearPage();

    setPageNumber((pageNumber) => pageNumber + 1);
  };

  const prevPage = () => {
    if (pageNumber <= 1) return;

    clearPage();
    setPageNumber((pageNumber) => pageNumber - 1);
  };

  const shadowDataURL = useMemo(() => {
    if (!props.pages.length) return;
    if (pageNumber - 2 < 0) return;

    return props.pages[pageNumber - 2].dataURL;
  }, [pageNumber, props.pages]);

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
        pages={props.pages}
        ready={gifReady}
      />
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    pages: state.pages,
    screen: state.screen,
    containerID: state.ui.canvasContainerID,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    addPage,
    saveColors,
    savePage,
    setDataURL,
    setCanFullscreen,
    setCanClear,
    updateScreen
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Flipbook);
