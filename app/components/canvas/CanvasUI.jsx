import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Menu from './ui/Menu';
import Overlay from './ui/Overlay';
import FullscreenButton from './ui/FullscreenButton';

const OpenMenu = styled.button`
  background: white;
  border: solid 2px black;
  display: ${props => props.isFullscreen ? 'block' : 'none'};
  height: 3rem;
  position: absolute;
  right: 1rem;
  top: 1rem;
  z-index: 100;
`;

function CanvasUI(props) {
  const { overlayOpts, menuOpts } = props;
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    const currentState = menuOpen;
    setMenuOpen(!currentState);
  };

  useEffect(() => {
    props.setCanMove(!menuOpen);
  }, [menuOpen]);

  return (
    <>
      <OpenMenu
        isFullscreen={props.isFullscreen}
        onClick={() => toggleMenu()}
      >{ menuOpen ? 'Close' : 'Open' }</OpenMenu>

      {
        props.canFullscreen &&
        <FullscreenButton
          isFullscreen={props.isFullscreen}
          toggleFullscreen={props.toggleFullscreen}
        />
      }

      {
        props.isFullscreen &&
        <Overlay
          options={overlayOpts}
        />
      }

      <Menu
        isOpen={menuOpen}
        options={menuOpts}
      />
    </>
  );
}

export default CanvasUI;
