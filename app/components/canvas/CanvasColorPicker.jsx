import React, { useState, useEffect } from 'react';

import 'rc-color-picker/assets/index.css';
import { ColorPicker } from 'rc-color-picker';

import {
  ColorCard,
  ColorCardCloseButton,
  ColorCardContainer,
  PenButtonWrapper,
  SaveColorButton,
} from './styles';

const MAX_COLOR_CARD_WIDTH = 26;

function CanvasColorPicker(props) {
  const [pen, setPen] = useState({});
  const [colors, setColors] = useState([]);
  const [cardsActive, setCardsActive] = useState(false);

  useEffect(() => {
    props.updatePen(pen);
  }, [pen]);

  const saveColor = e => {
    if (colors.indexOf(pen.color) > -1) return;

    e.stopPropagation();

    const oldColors = colors;
    setColors([...oldColors, pen.color]);
  };

  const changeColor = e => {
    setPen({ color: e.color });
  };

  const colorCards = () => {
    let cards = [];
    colors.forEach((val, index) => {
      cards.push(
        <ColorCard
          data-index={index}
          colorIndex={index} color={val} key={index}
          onClick={e => pickColor(e)}
          active={cardsActive}
        />
      );
    });
    return cards;
  };

  const expandSavedColors = e => {
    e.stopPropagation();
    setCardsActive(true);
  };

  const pickColor = e => {
    const index = e.target.dataset['index'];
    const pickedColor = colors[index];

    if (!cardsActive) return;

    e.stopPropagation();
    setPen({ color: pickedColor });
  };

  const closeColorCards = e => {
    e.stopPropagation();
    setCardsActive(false);
  };

  const dynamicLeft = () => {
    return dynamicWidth() + 3;
  };

  const dynamicWidth = () => {
    const width = (colors.length * 5) + 1;
    return width < MAX_COLOR_CARD_WIDTH ? width : MAX_COLOR_CARD_WIDTH;
  };

  return (
    <ColorPicker 
      placement={props.placement}
      onChange={e => changeColor(e)}
    >
      <div>
        <PenButtonWrapper
          color={pen.color || 'black'}
        >

          <ColorCardContainer
            onClick={e => expandSavedColors(e)}
            colorCount={colors.length}
            active={cardsActive}
            dynamicWidth={dynamicWidth()}
          >
            { colorCards() }
          </ColorCardContainer>

          <ColorCardCloseButton
            onClick={e => closeColorCards(e)}
            active={cardsActive}
            start={cardsActive ? `calc(100% + ${dynamicLeft()}rem)` : '-10rem'}
            end={cardsActive ? '-10rem' : `calc(100% + ${dynamicLeft()}rem)` }
          />
        </PenButtonWrapper>

        <SaveColorButton onClick={e => saveColor(e)}>save</SaveColorButton>
      </div>
    </ColorPicker>
  );
}

export default CanvasColorPicker;
