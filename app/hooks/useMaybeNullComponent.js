import { useCallback } from 'react';

function useMaybeNullComponent(component) {
  const maybeNull = useCallback((args) => {
    if (!component) return null;

    return component(args);
  }, [component]);

  return maybeNull;
}

export default useMaybeNullComponent;
