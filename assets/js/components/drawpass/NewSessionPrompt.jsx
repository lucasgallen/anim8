import React from 'react';

function NewSessionPrompt(props) {
  return (
    <div>
      <p>New to DrawPass? Click "start" to create a new session and create something with your  friends!</p>
      <button
        onClick={() => props.createNewSession()}
      >start</button>
    </div>
  );
}

export default NewSessionPrompt;
