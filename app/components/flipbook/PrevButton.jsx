import React from 'react'; 
import { Button } from '../styles/atoms';

function PrevButton({ disabled, prevPage }) {
  return (
    <Button
      disabled={disabled ? 'disabled' : false}
      onClick={prevPage}
      side='left'
      hoverColor={'white'}
      hoverBackground={'black'}
    >prev</Button>
  );
}

export default PrevButton;
