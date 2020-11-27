import React from 'react';
import { ClearButton } from '../styles';

function ClearCanvasButton(props) {
  const clearPage = () => {
    const canvas = props.targetCanvas;
    canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
  };

  return (
    <ClearButton
      onClick={() => clearPage()}
      side='inherit'
    >clear page</ClearButton>
  );
}

export default ClearCanvasButton;
