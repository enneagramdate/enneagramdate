import React, { KeyboardEventHandler, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import useUserStore, { UserState } from './userStore';
import isEmail from 'validator/lib/isEmail';
import isPostalCode from 'validator/lib/isPostalCode';
import { useNavigate } from 'react-router-dom';

interface Info {
  email: string;
  password: string;
  fullName: string;
  enneagramType: string;
  birthday: string;
  seekAgeRange: number[];
  gender: string;
  seekGender: string;
  seekRelationship: string;
  position: google.maps.LatLng | null;
  seekRadius: number;
}

type infoKey =
  | 'email'
  | 'password'
  | 'fullName'
  | 'enneagramType'
  | 'birthday'
  | 'seekAgeRangeLow'
  | 'seekAgeRangeHigh'
  | 'gender'
  | 'seekGender'
  | 'seekRelationship'
  | 'position'
  | 'seekRadius';

const defaultInfo: Info = {
  email: '',
  password: '',
  fullName: '',
  enneagramType: '',
  birthday: '',
  seekAgeRange: [17, 16],
  gender: '',
  seekGender: '',
  seekRelationship: '',
  position: null,
  seekRadius: 0,
};

const loader = new Loader({
  apiKey: 'AIzaSyBro2kUXbOjXXxiQqn7bhx1Udcf5Nowx4c',
  version: 'weekly',
});

const Signup = () => {
  const user: UserState = useUserStore((state) => state);
  const navigate = useNavigate();

  const [date, setDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const [info, updateInfo] = useState(defaultInfo);

  const zipToPos = (zip: string) => {
    loader.importLibrary('geocoding').then((lib) => {
      const geocoder = new lib.Geocoder();
      geocoder.geocode({ address: zip }, function (results, status) {
        if (results && results.length) {
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
    });
  };

  const [errors, updateErrors] = useState({
    email: false,
    go: true,
    zip: false,
    position: '',
    radius: false,
    lowAge: false,
    highAge: false,
    alert: '',
  });

  const inputHandler = (text: string, type: infoKey) => {
    errorHandler(text, type);
    const curInfo = { ...info };
    if (type === 'position') {
      if (!errors.zip) zipToPos(text);
      return;
    } else if (type === 'seekAgeRangeLow') {
      if (!errors.lowAge) curInfo.seekAgeRange[0] = Number(text);
    } else if (type === 'seekAgeRangeHigh') {
      if (!errors.highAge) curInfo.seekAgeRange[1] = Number(text);
    } else if (type === 'seekRadius') {
      if (!errors.radius) curInfo.seekRadius = Number(text);
    } else curInfo[type] = text;
    updateInfo(curInfo);
  };

  const errorHandler = (text: string, type: infoKey) => {
    const curErr = { ...errors };
    curErr.alert = '';
    if (type === 'email') {
      curErr.email = !isEmail(text);
    } else if (type === 'position') {
      curErr.zip = !isPostalCode(text, 'US');
    } else if (type === 'seekAgeRangeLow') {
      curErr.lowAge =
        !Number(text) ||
        Number(text) < 18 ||
        Number(text) > info.seekAgeRange[1];
    } else if (type === 'seekAgeRangeHigh') {
      curErr.highAge = !Number(text) || Number(text) < info.seekAgeRange[0];
    } else if (type === 'seekRadius') {
      curErr.radius = Number(text) < 1;
    }
    curErr.go = false;
    for (const [key, val] of Object.entries(info)) {
      if (
        !val ||
        (key === 'seekAgeRange' && (val[0] === 17 || val[1] === 16))
      ) {
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
        <label className="input-group">
          <span>Name</span>
          <input
            type="text"
            placeholder="Steve Harvey"
            className={`input input-bordered`}
            onChange={(event) => inputHandler(event.target.value, 'fullName')}
          />
        </label>
        <label className="input-group">
          <span>Enneagram Type</span>
          <select
            className="select select-bordered w-full max-w-xs"
            onChange={(event) =>
              inputHandler(event.target.value, 'enneagramType')
            }
          >
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
          </select>
        </label>
        <label className="input-group">
          <span>Birthday</span>
          <input
            type="date"
            className={`input input-bordered`}
            onChange={(event) => inputHandler(event.target.value, 'birthday')}
          />
        </label>
        <label className="input-group">
          <span>Zip Code</span>
          <input
            type="text"
            className={`input input-bordered ${
              errors.zip ? 'input-error' : ''
            }`}
            onChange={(event) => inputHandler(event.target.value, 'position')}
          />
        </label>
        <label className="input-group">
          <span>Gender</span>
          <select
            className="select select-bordered w-full max-w-xs"
            onChange={(event) => inputHandler(event.target.value, 'gender')}
          >
            <option>Female</option>
            <option>Male</option>
            <option>Non-binary</option>
          </select>
        </label>
        <label className="input-group">
          <span>Seeking</span>
          <select
            className="select select-bordered w-full max-w-xs"
            onChange={(event) => inputHandler(event.target.value, 'seekGender')}
          >
            <option>Female</option>
            <option>Male</option>
            <option>Non-binary</option>
          </select>
        </label>
        <label className="input-group">
          <span>Seeking</span>
          <select
            className="select select-bordered w-full max-w-xs"
            onChange={(event) =>
              inputHandler(event.target.value, 'seekRelationship')
            }
          >
            <option>Serious</option>
            <option>Casual</option>
          </select>
        </label>
        <label className="input-group">
          <span>Within</span>
          <input
            type="text"
            className={`input input-bordered ${
              errors.radius ? 'input-error' : ''
            }`}
            onChange={(event) => inputHandler(event.target.value, 'seekRadius')}
          />
          <span>Miles</span>
        </label>
        <label className="input-group">
          <span>Between</span>
          <input
            type="text"
            placeholder="18"
            className={`input input-bordered ${
              errors.lowAge ? 'input-error' : ''
            }`}
            onChange={(event) =>
              inputHandler(event.target.value, 'seekAgeRangeLow')
            }
          />
          <span>and</span>
          <input
            type="text"
            placeholder="118"
            className={`input input-bordered ${
              errors.highAge ? 'input-error' : ''
            }`}
            onChange={(event) =>
              inputHandler(event.target.value, 'seekAgeRangeHigh')
            }
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
