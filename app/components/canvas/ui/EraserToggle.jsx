import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { savePen } from '/app/actions/drawpass';

import { Button } from '/app/components/styles/atoms';

function EraserToggle(props) {
  const [isOn, setIsOn] = useState(props.pen.isEraser);

  const toggleEraser = () => {
    setIsOn(!isOn);
  };

  useEffect(() => {
    props.savePen({ isEraser: isOn });
  }, [isOn]);

  return (
    <Button
      onClick={() => toggleEraser()}
    >{ isOn ? 'Eraser On' : 'Eraser Off'}</Button>
  );
}

const mapStateToProps = state => {
  return {
    pen: state.pen,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ savePen }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EraserToggle);
