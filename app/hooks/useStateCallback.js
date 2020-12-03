import  { useEffect, useRef, useState } from 'react';

function useStateCallback(initialState) {
  const [state, setState] = useState(initialState);

  const cb = useRef(null);

  useEffect(() => {
    if (!cb.current) return;

    cb.current(state);
  }, [state]);

  const setStateWithCallback = (newState, callback=()=>{}) => {
    cb.current = callback;
    setState(newState);
  };

  return [state, setStateWithCallback];
}

export default useStateCallback;
