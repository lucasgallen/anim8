import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { setCanMove } from '/app/actions/canvas';

import Menu from './Menu';
import Overlay from './Overlay';
import FullscreenButton from './FullscreenButton';

import { Button } from '/app/components/styles/atoms';

const Download = styled.div`
  bottom: 1rem;
  position: absolute;
  right: 1rem;
  z-index: 2;
`;

const OpenMenu = styled(Button)`
  display: ${props => props.fullscreen ? 'block' : 'none'};
  position: absolute;
  right: 1rem;
  top: 1rem;
  z-index: 100;
`;

const SaveContainer = styled.div`
  display: block;
  position: absolute;
  right: 1rem;
  top: 1rem;
  z-index: 2;
`;

function CanvasUI(props) {
  const dispatch = useDispatch();
  const {
    fullscreen,
    canFullscreen,
  } = useSelector(state => ({
    fullscreen: state.ui.fullscreen,
    canFullscreen: state.ui.canFullscreen,
  }));

  const { next, prev } = props;
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    const currentState = menuOpen;
    setMenuOpen(!currentState);
  };

  useEffect(() => {
    dispatch(setCanMove(!menuOpen));
  }, [menuOpen]);

  return (
    <>
      {
        canFullscreen &&
        <FullscreenButton
          isFullscreen={fullscreen}
        />
      }

      { !fullscreen &&
        <SaveContainer>
          { props.save() }
        </SaveContainer>
      }

      { !fullscreen &&
        <Download>
          { props.downloadLink && props.downloadLink() }
        </Download>
      }

      <OpenMenu
        fullscreen={fullscreen}
        onClick={toggleMenu}
      >{ menuOpen ? 'Close' : 'Settings' }</OpenMenu>

      {
        fullscreen &&
        <Overlay {...{ next, prev }} />
      }

      <Menu
        isOpen={menuOpen}
        isFullscreen={fullscreen}
        toggleMenu={toggleMenu}
      />
    </>
  );
}

export default React.memo(CanvasUI);
