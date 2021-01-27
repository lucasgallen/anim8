import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import CanvasColorPicker from './CanvasColorPicker';
import EraserToggle from './EraserToggle';
import PenWidthSlider from './PenWidthSlider';

const Container = styled.div`
  align-items: center;
  background: #5f9ea099;
  display: ${props => props.isFullscreen ? 'flex' : 'none' };
  flex-direction: column;
  justify-content: space-evenly;
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

const SKIP_LENGTH_MS = 100;

function Menu(props) {
  const [timedMenuSkip, setTimedMenuSkip] = useState(false);

  const { 
    colorPickerParent,
    isFullscreen,
  } = props.options;

  const container = useRef(null);

  useEffect(() => {
    if (!timedMenuSkip) return;

    setTimeout(() => {
      setTimedMenuSkip(false);
    }, SKIP_LENGTH_MS);
  }, [timedMenuSkip]);

  const handleContainer = e => {
    if (e.target !== container.current) return;
    if (timedMenuSkip) return;

    props.toggleMenu();
  };

  return (
    <Container
      isFullscreen={isFullscreen}
      isOpen={props.isOpen}
      onClick={e => handleContainer(e)}
      ref={container}
    >
      <CanvasColorPicker
        placement='bottomRight'
        container={colorPickerParent}
        setTimedMenuSkip={skip => setTimedMenuSkip(skip)}
      />
      <PenWidthSlider />
      <EraserToggle />
    </Container>
  );
}

export default Menu;
