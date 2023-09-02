import React, { KeyboardEventHandler, useState } from 'react';
import useUserStore, { UserState } from './stores/userStore';
import isEmail from 'validator/lib/isEmail';
import { useNavigate } from 'react-router-dom';
import recsStore from './stores/recsStore';
import matchesStore from './stores/matchesStore';
import { MatchChats, Matches, RecommendedUser } from './types';
import { getAge, getUserData } from './data/utils';

const Login = () => {
  const user: UserState = useUserStore((state) => state);
  const navigate = useNavigate();
  const setRecs = recsStore.use.setRecs();
  const setMatches = matchesStore.use.setMatches();
  const setMatchChats = matchesStore.use.setMatchChats();

  const [info, updateInfo] = useState({
    email: '',
    password: '',
  });

  const [errors, updateErrors] = useState({
    email: false,
    go: true,
    alert: '',
  });

  const inputHandler = (text: string, type: 'email' | 'password') => {
    errorHandler(text, type);
    const curInfo = { ...info };
    curInfo[type] = text;
    updateInfo(curInfo);
  };

  const errorHandler = (text: string, type: 'email' | 'password') => {
    const curErr = { ...errors };
    curErr.alert = '';
    if (type === 'email') {
      curErr.email = !isEmail(text);
    }
    curErr.go = false;
    for (const [key, val] of Object.entries(info)) {
      if (val === '') {
        curErr.go = true;
        break;
      }
    }
    if (curErr.email) curErr.go = true;
    updateErrors(curErr);
  };

  const sender = async () => {
    const res = await fetch('/api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/JSON',
      },
      body: JSON.stringify(info),
    });
    const parseRes = await res.json();
    if (res.ok) {
      // extract relevant data from response
      const { properties, elementId, userRecs, userMatches, userMatchChats } =
        getUserData(parseRes);
      // set state
      user.setUserState(properties, elementId);
      setRecs(userRecs);
      setMatches(userMatches);
      setMatchChats(userMatchChats);
      navigate('/recs');
    } else updateErrors({ ...errors, alert: parseRes.err });
  };

  const keyDownHandler: KeyboardEventHandler = (e) => {
    if (e.code === 'Enter' && !errors.go) {
      sender();
    }
  };

  return (
    <>
      <div className="bg-primary text-primary-content flex items-center justify-center h-full">
        <div className="form-control w-full max-w-xs">
          <label className="input-group text-white w-full mb-4">
            <span className="bg-secondary">Email</span>
            <input
              type="text"
              placeholder="lover@enneagramdate.com"
              className={`input input-bordered bg-opacity-20 w-full ${
                errors.email ? 'input-error' : ''
              }`}
              onChange={(event) => inputHandler(event.target.value, 'email')}
            />
          </label>
          <label className="input-group text-white mb-4">
            <span className="bg-secondary">Password</span>
            <input
              type="password"
              placeholder="Shhh"
              className="input input-bordered bg-opacity-20 w-full"
              onChange={(event) => inputHandler(event.target.value, 'password')}
              onKeyDown={keyDownHandler}
            />
          </label>
          <button
            className="btn btn-secondary mb-4"
            disabled={errors.go}
            onClick={sender}
          >
            Go!
          </button>
          {errors.alert && (
            <div className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{errors.alert}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
