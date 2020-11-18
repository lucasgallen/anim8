import { useEffect, useState } from 'react';

import useMinWait from './useMinWait';

function useOpenSession(slug, setLoading, cb) {
  const callback = cb || function(){};
  const [ json, setJSON ] = useState();

  const handleResponse = res => {
    setLoading(false);
    return res.json();
  };

  const handleOpenSession = json => {
    setJSON(json);
  };

  const openSessionPromise = fetch(`${process.env.API_SERVER}/api/session_group/${slug}`, {
    method: 'get',
    headers: new Headers({
      'Authorization': `Token token=${process.env.API_TOKEN}`,
      'Content-Type': 'application/json',
    }),
  });

  const minPromiseFetcher = useMinWait(openSessionPromise);

  useEffect(() => {
    callback({ json });
  }, [json]);

  return (() => {
    setLoading(true);

    minPromiseFetcher()
      .then(response => handleResponse(response))
      .then(data => handleOpenSession(data));
  });
}

export default useOpenSession;
