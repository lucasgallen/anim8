import  { useState } from 'react';

function useStateCallback(initialState, callback=()=>{}) {
  return useState({
    state: initialState,
    callback,
  });
}

export default useStateCallback;
