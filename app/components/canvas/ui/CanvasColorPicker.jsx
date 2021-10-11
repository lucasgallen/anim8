import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

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
  const { color, alpha } = props.pen;
  const [penColor, setPenColor] = useState({color, alpha});
  const [cardsActive, setCardsActive] = useState(false);
  const [colorHash, setColorHash] = useState(initColorHash(props.colors));

  useEffect(() => {
    props.savePen(penColor);
  }, [penColor]);

  useEffect(() => {
    const newColor = props.colors.slice(-1)[0];
    const newEntry = { [`${newColor.color}${newColor.alpha}`]: 1 };

    setColorHash({ ...colorHash, ...newEntry });
  }, [props.colors]);

  const saveColor = e => {
    const colorKey = `${penColor.color}${penColor.alpha}`;
    if (colorHash[colorKey]) return;

    e.stopPropagation();
    props.addColor(penColor);
  };

  const changeColor = e => {
    setPenColor({ color: e.color.slice(1), alpha: e.alpha / 100 });
  };

  const colorCards = () => {
    const maxSector = 20;
    const minSector = 5;
    let sectorSize = Math.floor(360 / props.colors.length);
    sectorSize = sectorSize > maxSector ? maxSector : sectorSize;
    sectorSize = sectorSize < minSector ? minSector : sectorSize;

    return props.colors.map((color, index) => (
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
    const pickedColor = props.colors[index];

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
        colorCount={props.colors.length}
        active={cardsActive}
      >
        { colorCards() }
      </ColorCardContainer>
    </Container>
  );
}

const mapStateToProps = state => {
  return {
    colors: state.colors,
    pen: state.pen,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ addColor, savePen }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CanvasColorPicker);
