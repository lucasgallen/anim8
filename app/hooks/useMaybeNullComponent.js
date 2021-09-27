function useMaybeNullComponent(component) {
  return args => {
    if (!component) return null;

    return component(args);
  };
}

export default useMaybeNullComponent;
