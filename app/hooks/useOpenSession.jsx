import { useEffect, useState } from 'react';

import useMinWait from './useMinWait';

function useOpenSession(slug, setLoading, cb) {
  const callback = cb || function(){};
  const [ json, setJSON ] = useState();
  const [ res, setRes ] = useState();

  const openSessionPromise = () => (
    fetch(`${process.env.API_SERVER}/api/session_group/${slug}`, {
      method: 'get',
      headers: new Headers({
        'Authorization': `Token token=${process.env.API_TOKEN}`,
        'Content-Type': 'application/json',
      }),
    })
  );

  const minPromise = useMinWait(openSessionPromise);

  const handleResponse = res => {
    setRes(res);
    setLoading(false);
    return res.json();
  };

  const handleOpenSession = json => {
    setJSON(json);
  };

  useEffect(() => {
    if (!json || !res) return;

    callback({ res, json });
  }, [json, res]);

  return (() => {
    setLoading(true);
    minPromise()
      .then(response => handleResponse(response))
      .then(data => handleOpenSession(data));
  });
}

export default useOpenSession;
