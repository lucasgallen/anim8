const MIN_WAIT_MS = 750;

function useMinWait(promise, wait = MIN_WAIT_MS) {
  const timedPromise = () => {
    let resolve;

    setTimeout(() => resolve(), wait);

    return new Promise(_resolve => {
      resolve = _resolve;
    });
  };

  return (() => (
    Promise.all([
      promise,
      timedPromise(),
    ]).then(([data]) => data)
  ));
}

export default useMinWait;
