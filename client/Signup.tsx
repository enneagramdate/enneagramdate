import React, { KeyboardEventHandler, useState } from 'react';
import { google } from 'google-maps';
import useUserStore, { UserState } from './userStore';
import isEmail from 'validator/lib/isEmail';
import { useNavigate } from 'react-router-dom';

interface Info {
  email: string;
  password: string;
  fullName: string;
  enneagramType: number;
  birthday: string;
  seekAgeRange: number[] | null;
  gender: string;
  seekGender: string;
  seekRelationship: string;
  position: google.maps.LatLng | null;
  seekRadius: number;
}

const defaultInfo: Info = {
  email: '',
  password: '',
  fullName: '',
  enneagramType: 0,
  birthday: '',
  seekAgeRange: null,
  gender: '',
  seekGender: '',
  seekRelationship: '',
  position: null,
  seekRadius: 0,
};

const Signup = () => {
  const user: UserState = useUserStore((state) => state);
  const navigate = useNavigate();
  const geocoder = new google.maps.Geocoder();

  const [info, updateInfo] = useState(defaultInfo);

  const zipToPos = (zip: string) => {
    geocoder.geocode({ address: zip }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        const centroid = results[0].geometry.location;
        const curInfo = { ...info };
        curInfo.position = centroid;
        updateInfo(curInfo);
      } else {
        const curErr = { ...errors };
        curErr.position = status;
        updateErrors(curErr);
      }
    });
  };

  const [errors, updateErrors] = useState({
    email: false,
    go: true,
    position: '',
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
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/JSON',
      },
      body: JSON.stringify(info),
    });
    const parseRes = await res.json();
    if (res.ok) {
      user.setUserState(parseRes);
      navigate('/main');
    } else updateErrors({ ...errors, alert: parseRes });
  };

  const keyDownHandler: KeyboardEventHandler = (e) => {
    if (e.code === '13' && !errors.go) {
      sender();
    }
  };

  return (
    <>
      <div className="form-control w-full max-w-xs">
        <label className="input-group">
          <span>Email</span>
          <input
            type="text"
            placeholder="lover@enneagramdate.com"
            className={`input input-bordered ${
              errors.email ? 'input-error' : ''
            }`}
            onChange={(event) => inputHandler(event.target.value, 'email')}
          />
        </label>
        <label className="input-group">
          <span>Password</span>
          <input
            type="password"
            placeholder="Shhh"
            className="input input-bordered"
            onChange={(event) => inputHandler(event.target.value, 'password')}
            onKeyDown={keyDownHandler}
          />
        </label>
        <button className="btn" disabled={errors.go} onClick={sender}>
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
    </>
  );
};

export default Signup;
