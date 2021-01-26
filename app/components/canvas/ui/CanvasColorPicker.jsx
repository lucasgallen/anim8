import React, { useState, useEffect, useRef } from 'react';
import { rgbaColor } from '/app/helpers';
import styled from 'styled-components';

import 'rc-color-picker/assets/index.css';
import { ColorPicker } from 'rc-color-picker';

import {
  ColorCard,
  ColorCardContainer,
  PenButtonWrapper,
  PenIndicator,
  SaveColorButton,
} from '../styles';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

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

function CanvasColorPicker(props) {
  const [penColor, setPenColor] = useState({});
  const [colors, setColors] = useState([]);
  const [cardsActive, setCardsActive] = useState(false);

  const isInit = useRef(true);

  useEffect(() => {
    setColors(props.colorArray);
    isInit.current = false;
  }, []);

  useEffect(() => {
    if (isInit.current) return;

    props.updatePenColor(penColor);
  }, [penColor]);

  useEffect(() => {
    if (isInit.current) return;
    props.updateColors(colors);
  }, [colors]);

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
          colorIndex={index}
          color={rgbaColor(val)}
          key={index}
          onClick={e => pickColor(e)}
          active={cardsActive}
        />
      );
    });
    return cards;
  };

  const toggleCardContainer = e => {
    e.stopPropagation();

    if (!cardsActive) {
      setCardsActive(true);
    } else {
      closeColorCards(e);
    }
  };

  const pickColor = e => {
    const index = e.target.dataset['index'];
    const pickedColor = colors[index];

    if (!cardsActive) return;

    e.stopPropagation();
    setPenColor(pickedColor);
    closeColorCards(e);
  };

  const closeColorCards = e => {
    e.stopPropagation();
    setCardsActive(false);
  };

  return (
    <Container>
      <CustomColorPicker
        placement={props.placement}
        onChange={e => changeColor(e)}
        getCalendarContainer={() => props.container}
        onClose={() => props.setTimedMenuSkip(true)}
      >
        <div>
          <PenButtonWrapper>
            <PenIndicator color={rgbaColor(penColor)} />
          </PenButtonWrapper>

          <SaveColorButton onClick={e => saveColor(e)}>save</SaveColorButton>
        </div>
      </CustomColorPicker>

      <ColorCardContainer
        onClick={e => toggleCardContainer(e)}
        colorCount={colors.length}
        active={cardsActive}
      >
        { colorCards() }
      </ColorCardContainer>
    </Container>
  );
}

export default CanvasColorPicker;
