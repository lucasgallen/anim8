import React from 'react';
import styled from 'styled-components';

import CanvasColorPicker from '../CanvasColorPicker';

const Container = styled.div`
  align-items: flex-start;
  background: #5f9ea099;
  display: ${props => props.isFullscreen ? 'flex' : 'none' };
  justify-content: space-between;
  left: 0;
  min-height: calc(100vh - 6rem);
  opacity: ${props => props.isOpen ? '1' : '0' };
  ${props => !props.isOpen ? 'pointer-events: none;' : ''}
  padding: 3rem;
  position: absolute;
  right: 0;
  top: 0;
  transition: opacity 0.25s ease-in-out;
  z-index: 10;
`;

function Menu(props) {
  const { 
    colorPickerParent,
    isFullscreen,
    updatePenColor,
  } = props.options;

  return (
    <Container
      isFullscreen={isFullscreen}
      isOpen={props.isOpen}
    >
      <CanvasColorPicker
        placement='bottomRight'
        container={colorPickerParent}
        updatePenColor={updatePenColor}
      />
    </Container>
  );
}

export default Menu;
