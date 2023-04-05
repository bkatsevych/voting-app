import React, { useState } from 'react';
import { AppPage, actions } from '../state';
import { makeRequest } from '../api';
import { Poll } from 'shared/poll-types';

const Join: React.FC = () => {
  const [pollID, setPollID] = useState('');
  const [name, setName] = useState('');
  const [apiError, setApiError] = useState('');

  const areFieldsValid = (): boolean => {
    if (pollID.length < 6 || pollID.length > 6) return false;
    if (name.length < 1 || name.length > 25) return false;
    return true;
  };

  const handleJoinPoll = async () => {
    actions.startLoading();
    setApiError('');

    const { data, error } = await makeRequest<{
      poll: Poll;
      accessToken: string;
    }>('/polls/join', {
      method: 'POST',
      body: JSON.stringify({ pollID, name }),
    });

    if (error && error.statusCode === 400) {
      setApiError('Please make sure to include a poll topic');
    } else if (error && !error.statusCode) {
      setApiError('Unknown api error');
    } else {
      actions.initializePoll(data.poll);
      actions.setPollAccessToken(data.accessToken);
      actions.setPage(AppPage.WaitingRoom);
    }
    actions.stopLoading();
  };

  return (
    <div className="flex flex-col w-full justify-around items-stretch h-full mx-auto max-w-sm">
      <div className="mb-12">
        <div className="mt-4">
          <h3 className="text-center">Enter code provided by your friend</h3>
          <div className="text-center w-full">
            <input
              maxLength={6}
              onChange={(e) => setPollID(e.target.value.toUpperCase())}
              className="box info w-full"
              autoCapitalize="characters"
              style={{ textTransform: 'uppercase' }}
            />
          </div>
        </div>
        <div className="my-4">
          <h3 className="text-center">Your name</h3>
          <div className="text-center w-full">
            <input
              maxLength={25}
              onChange={(e) => setName(e.target.value)}
              className="box info w-full"
            />
          </div>
        </div>
        {apiError && (
          <p className="text-center text-red-600 font-light mt-8">{apiError}</p>
        )}
      </div>
      <div className="my-12 flex flex-col justify-center items-center">
        <button
          onClick={handleJoinPoll}
          disabled={!areFieldsValid}
          className="box btn-orange w-32 my-2"
        >
          Join
        </button>
        <button
          onClick={() => actions.startOver()}
          className="box btn-purple w-32 my-2"
        >
          Start over
        </button>
      </div>
    </div>
  );
};

export default Join;
