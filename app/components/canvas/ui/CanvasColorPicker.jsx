import React, { useState, useEffect } from 'react';
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
  const [penColor, setPenColor] = useState(props.pen);
  const [cardsActive, setCardsActive] = useState(false);

  useEffect(() => {
    props.updatePenColor(penColor);
  }, [penColor]);

  const saveColor = e => {
    if (props.colorArray.indexOf(penColor) > -1) return;

    e.stopPropagation();

    const oldColors = props.colorArray;
    props.updateColors([...oldColors, penColor]);
  };

  const changeColor = e => {
    setPenColor({ color: e.color.slice(1), alpha: e.alpha / 100 });
  };

  const colorCards = () => {
    const maxSector = 20;
    const minSector = 5;
    let sectorSize = Math.floor(360 / props.colorArray.length);
    sectorSize = sectorSize > maxSector ? maxSector : sectorSize;
    sectorSize = sectorSize < minSector ? minSector : sectorSize;

    return props.colorArray.map((color, index) => (
      <ColorCard
        data-index={index}
        rotation={index * sectorSize}
        color={rgbaColor(color)}
        key={index}
        onClick={e => pickColor(e)}
        active={cardsActive}
      />
    ));
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
    const pickedColor = props.colorArray[index];

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
        colorCount={props.colorArray.length}
        active={cardsActive}
      >
        { colorCards() }
      </ColorCardContainer>
    </Container>
  );
}

export default CanvasColorPicker;
