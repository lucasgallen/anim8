import React, { useEffect, useState } from 'react';

import { Button } from '/app/components/styles/atoms';

function EraserToggle(props) {
  const [isOn, setIsOn] = useState(false);

  const toggleEraser = () => {
    setIsOn(!isOn);
  };

  useEffect(() => {
    props.setPenEraser(isOn);
  }, [isOn]);

  return (
    <Button
      onClick={() => toggleEraser()}
    >{ isOn ? 'Eraser On' : 'Eraser Off'}</Button>
  );
}

export default EraserToggle;
