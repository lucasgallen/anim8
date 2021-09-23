import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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
  display: ${props => props.isFullscreen ? 'block' : 'none'};
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
      {
        props.canFullscreen &&
        <FullscreenButton
          isFullscreen={props.isFullscreen}
          toggleFullscreen={props.toggleFullscreen}
        />
      }

      <SaveContainer>
        { !props.isFullscreen && props.save }
      </SaveContainer>

      <Download>
        { !props.isFullscreen && props.downloadLink }
      </Download>

      <OpenMenu
        isFullscreen={props.isFullscreen}
        onClick={toggleMenu}
      >{ menuOpen ? 'Close' : 'Settings' }</OpenMenu>

      {
        props.isFullscreen &&
        <Overlay
          options={overlayOpts}
        />
      }

      <Menu
        isOpen={menuOpen}
        options={menuOpts}
        toggleMenu={toggleMenu}
      />
    </>
  );
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setCanMove }, dispatch);
};

export default connect(null, mapDispatchToProps)(CanvasUI);
