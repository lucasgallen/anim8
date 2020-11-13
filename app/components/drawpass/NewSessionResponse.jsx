import React, { useState, useEffect } from 'react';
import ResponseMessage from '../ResponseMessage';

const TOO_MANY = 'you started too many sessions. try again later';
const LOADING = 'starting session...';

const NewSessionResponse = props => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const msg = responseMessage(props.response.status) || '';
    setMessage(msg);
  }, [props.response]);

  useEffect(() => {
    if (props.loading) {
      setMessage(LOADING);
    }
  }, [props.loading]);

  const responseMessage = status => {
    switch (status) {
    case 200:
      return;
    case 429:
      return TOO_MANY;
    default:
      return;
    }
  };

  return (
    <ResponseMessage message={message} />
  );
};

export default NewSessionResponse;
