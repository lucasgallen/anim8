import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addColor, savePen } from '/app/actions/drawpass';
import { rgbaColor } from '/app/helpers';
import styled from 'styled-components';

import 'rc-color-picker/assets/index.css';

import {
  ColorCard,
  ColorCardContainer,
  CustomColorPicker,
  PenButtonWrapper,
  PenIndicator,
  SaveColorButton,
} from '../styles';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

function initColorHash(colorArray) {
  let hash = {};
  colorArray.forEach(color => {
    hash[`${color.color}${color.alpha}`] = 1;
  });
  return hash;
}

function CanvasColorPicker(props) {
  const dispatch = useDispatch();
  const {
    colors,
    pen,
  } = useSelector(state => ({
    colors: state.colors,
    pen: state.pen,
  }));

  const { color, alpha } = pen;
  const [penColor, setPenColor] = useState({color, alpha});
  const [cardsActive, setCardsActive] = useState(false);
  const [colorHash, setColorHash] = useState(initColorHash(colors));

  useEffect(() => {
    dispatch(savePen(penColor));
  }, [penColor]);

  useEffect(() => {
    const newColor = colors.slice(-1)[0];
    const newEntry = { [`${newColor.color}${newColor.alpha}`]: 1 };

    setColorHash({ ...colorHash, ...newEntry });
  }, [colors]);

  const saveColor = e => {
    const colorKey = `${penColor.color}${penColor.alpha}`;
    if (colorHash[colorKey]) return;

    e.stopPropagation();
    dispatch(addColor(penColor));
  };

  const changeColor = e => {
    setPenColor({ color: e.color.slice(1), alpha: e.alpha / 100 });
  };

  const colorCards = () => {
    const maxSector = 20;
    const minSector = 5;
    let sectorSize = Math.floor(360 / colors.length);
    sectorSize = sectorSize > maxSector ? maxSector : sectorSize;
    sectorSize = sectorSize < minSector ? minSector : sectorSize;

    return colors.map((color, index) => (
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
