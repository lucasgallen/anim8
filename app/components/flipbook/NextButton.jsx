import React from 'react';
import { Button } from '../styles/atoms';

function NextButton({ nextPage }) {
  return (
    <Button
      onClick={nextPage}
      side='right'
      hoverColor={'white'}
      hoverBackground={'black'}
    >next</Button>
  );
}

export default NextButton;
