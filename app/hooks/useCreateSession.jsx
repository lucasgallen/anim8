import { useEffect, useState } from 'react';

function useCreateSession(setLoading, cb) {
  const callback = cb || function(){};
  const [ response, setResponse ] = useState();
  const [ json, setJSON ] = useState();

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

    fetch(`${process.env.API_SERVER}/api/session_groups/new_session`, {
      method: 'get',
      headers: new Headers({
        'Authorization': `Token token=${process.env.API_TOKEN}`,
        'Content-Type': 'application/json',
      }),
    }).then(res => handleResponse(res))
      .then(data => handleData(data));
  });
}

export default useCreateSession;
