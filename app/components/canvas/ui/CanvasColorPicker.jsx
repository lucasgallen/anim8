import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import 'rc-color-picker/assets/index.css';
import { ColorPicker } from 'rc-color-picker';

import {
  ColorCard,
  ColorCardCloseButton,
  ColorCardContainer,
  PenButtonWrapper,
  SaveColorButton,
} from '../styles';

const CustomColorPicker = styled(ColorPicker)`
  .rc-color-picker-panel {
    max-width: 28rem;
    width: 100%;
  }

  .rc-color-picker-panel-board-hsv {
    height: 0px;
    padding-bottom: 100%;
    width: 100%;
  }

  .rc-color-picker-panel-wrap {
    height: 6.5rem;

    .rc-color-picker-panel-wrap-ribbon, .rc-color-picker-panel-wrap-alpha {
      height: 3rem;
      right: 8.1rem;
    }
  }

  .rc-color-picker-panel-preview {
    height: 6.5rem;
    width: 6.5rem;

    span, input[type=color] {
      width: 100%;
    }
  }

  .rc-color-picker-panel-wrap[style='height: 40px; margin-top: 6px;'] {
    display: none;
  }
`;

const MAX_COLOR_CARD_WIDTH = 26;

function CanvasColorPicker(props) {
  const [penColor, setPenColor] = useState({});
  const [colors, setColors] = useState([]);
  const [cardsActive, setCardsActive] = useState(false);

  useEffect(() => {
    props.updatePenColor(penColor);
  }, [penColor]);

  const saveColor = e => {
    if (colors.indexOf(penColor) > -1) return;

    e.stopPropagation();

    const oldColors = colors;
    setColors([...oldColors, penColor]);
  };

  const changeColor = e => {
    setPenColor({ color: e.color.slice(1), alpha: e.alpha / 100 });
  };

  const colorCards = () => {
    let cards = [];
    colors.forEach((val, index) => {
      cards.push(
        <ColorCard
          data-index={index}
          colorIndex={index} color={val.color} key={index}
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
    setPenColor(pickedColor);
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
    <CustomColorPicker
      placement={props.placement}
      onChange={e => changeColor(e)}
      getCalendarContainer={() => props.container}
      onClose={() => props.setTimedMenuSkip(true)}
    >
      <div>
        <PenButtonWrapper
          color={ penColor.color ? `#${penColor.color}` : 'black'}
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
    </CustomColorPicker>
  );
}

export default CanvasColorPicker;
