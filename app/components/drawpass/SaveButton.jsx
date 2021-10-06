import React from 'react';

import { SaveButton as StyledButton } from './styles/illustrator';

function SaveButton(props) {
  return (
    <StyledButton
      disabled={props.canSave ? false : 'disabled'}
      isSaving={props.isSaving}
      onClick={props.handleSaveImage}
    >{props.saveLabel}</StyledButton>
  );
}

export default SaveButton;
