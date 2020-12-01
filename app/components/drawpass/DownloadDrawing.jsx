import React from 'react';

import { Button } from '/app/components/styles/atoms';

function DownloadDrawing(props) {
  return (
    <Button as='a'
      href={props.dataURL}
      download={`drawpass--session-${props.sessionID}.png`}
    >
      Download Image
    </Button>
  );
}

export default DownloadDrawing;
