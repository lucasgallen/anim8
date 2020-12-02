import { useEffect, useState } from 'react';

import useMinWait from './useMinWait';

function useCreateSession(setLoading, cb) {
  const callback = cb || function(){};
  const [ response, setResponse ] = useState();
  const [ json, setJSON ] = useState();

  const createSessionPromise = () => (
    fetch(`${process.env.API_SERVER}/api/session_groups/new_session`, {
      method: 'get',
      headers: new Headers({
        'Authorization': `Token token=${process.env.API_TOKEN}`,
        'Content-Type': 'application/json',
      }),
    })
  );

  const minCreate = useMinWait(createSessionPromise);

  const handleResponse = res => {
    setLoading(false);
    setResponse(res);

    return res.ok ? res.json() : {};
  };

  const handleData = data => {
    setJSON(data);
  };

  useEffect(() => {
    callback({ response, json });
  }, [json]);

  return (() => {
    setLoading(true);

    minCreate()
      .then(res => handleResponse(res))
      .then(data => handleData(data));
  });
}

export default useCreateSession;
