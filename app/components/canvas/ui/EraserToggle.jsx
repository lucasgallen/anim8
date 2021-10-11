import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { savePen } from '/app/actions/drawpass';

import { Button } from '/app/components/styles/atoms';

function EraserToggle() {
  const dispatch = useDispatch();
  const pen = useSelector(state => state.pen);
  const [isOn, setIsOn] = useState(pen.isEraser);

  const toggleEraser = () => {
    setIsOn(!isOn);
  };

  useEffect(() => {
    dispatch(savePen({ isEraser: isOn }));
  }, [isOn]);

  return (
    <Button
      onClick={() => toggleEraser()}
    >{ isOn ? 'Eraser On' : 'Eraser Off'}</Button>
  );
}
export default EraserToggle;
