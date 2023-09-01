import React, { KeyboardEventHandler, useState } from 'react';
import useUserStore, { UserState } from './stores/userStore';
import isEmail from 'validator/lib/isEmail';
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
  location: string;
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
  | 'location'
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
  location: '',
  seekRadius: 0,
};

const Signup = () => {
  const user: UserState = useUserStore((state) => state);

  const navigate = useNavigate();

  const [image, updateImage] = React.useState(null);

  const [info, updateInfo] = useState(defaultInfo);

  const [errors, updateErrors] = useState({
    email: false,
    go: true,
    zip: false,
    radius: false,
    lowAge: false,
    highAge: false,
    alert: '',
  });

  const inputHandler = (text: string, type: infoKey) => {
    errorHandler(text, type);
    const curInfo = { ...info };
    if (type === 'seekAgeRangeLow') {
      curInfo.seekAgeRange[0] = Number(text);
    } else if (type === 'seekAgeRangeHigh') {
      curInfo.seekAgeRange[1] = Number(text);
    } else if (type === 'seekRadius') {
      curInfo.seekRadius = Number(text);
    } else if (type === 'location') {
      const addArray = text.split(' ');
      curInfo.location = addArray.join('%20');
    } else curInfo[type] = text;
    updateInfo(curInfo);
  };

  const errorHandler = (text: string, type: infoKey) => {
    const curErr = { ...errors };
    curErr.alert = '';
    if (type === 'email') {
      curErr.email = !isEmail(text);
    } else if (type === 'seekAgeRangeLow') {
      const age = Number(text);
      curErr.lowAge = !age || age < 18 || age > info.seekAgeRange[1];
      curErr.highAge = info.seekAgeRange[1] < age;
    } else if (type === 'seekAgeRangeHigh') {
      const age = Number(text);
      curErr.lowAge = info.seekAgeRange[0] < 18 || info.seekAgeRange[0] > age;
      curErr.highAge = !age || age < info.seekAgeRange[0];
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
    if (
      curErr.email ||
      curErr.radius ||
      curErr.zip ||
      curErr.highAge ||
      curErr.lowAge
    )
      curErr.go = true;
    updateErrors(curErr);
  };

  const sender = async () => {
    if (image) {
      const formData = new FormData();
      if (image) formData.append('image', image);
      for (const [key, val] of Object.entries(info)) {
        formData.append(key, val);
      }
      const res = await fetch('/api/signup/', {
        method: 'POST',
        body: formData,
      });
      const parseRes = await res.json();
      if (res.ok) {
        const { properties, elementId } = parseRes.user.records[0]._fields[0];
        user.setUserState(properties, elementId);
        navigate('/recs');
      } else updateErrors({ ...errors, alert: parseRes.err });
    } else {
      const res = await fetch('/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'Application/JSON',
        },
        body: JSON.stringify(info),
      });
      const parseRes = await res.json();
      if (res.ok) {
        //const latestRel = parseRes.latestRelationships.records;
        const { properties, elementId } = parseRes.user.records[0]._fields[0];
        user.setUserState(properties, elementId);
        navigate('/recs');
      } else updateErrors({ ...errors, alert: parseRes.err });
    }
  };

  const keyDownHandler: KeyboardEventHandler = (e) => {
    if (e.code === '13' && !errors.go) {
      sender();
    }
  };

  return (
    <>
      <div className="bg-primary text-primary-content text-white flex items-center justify-center h-full">
        <div className="form-control w-full max-w-lg flex items-center justify-center">
          <label className="input-group max-w-xs mb-2">
            <span className="bg-secondary">Email</span>
            <input
              type="text"
              placeholder="wingman@email.com"
              className={`input input-bordered bg-opacity-20 w-full ${
                errors.email ? 'input-error' : ''
              }`}
              onChange={(event) => inputHandler(event.target.value, 'email')}
            />
          </label>
          <label className="input-group max-w-xs mb-2">
            <span className="bg-secondary">Password</span>
            <input
              type="password"
              placeholder="Shhh"
              className="input input-bordered bg-opacity-20 w-full"
              onChange={(event) => inputHandler(event.target.value, 'password')}
              onKeyDown={keyDownHandler}
            />
          </label>
          <label className="input-group max-w-xs mb-2">
            <span className="bg-secondary">Name</span>
            <input
              type="text"
              placeholder="Steve Harvey"
              className={`input input-bordered bg-opacity-20 w-full`}
              onChange={(event) => inputHandler(event.target.value, 'fullName')}
            />
          </label>
          <label className="input-group max-w-xs mb-2">
            <span className="bg-secondary whitespace-pre">Enneagram Type</span>
            <select
              className="select select-bordered w-full max-w-xs bg-opacity-20"
              defaultValue="1-9"
              onChange={(event) =>
                inputHandler(event.target.value, 'enneagramType')
              }
            >
              <option disabled>1-9</option>
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
          <label className="input-group max-w-xs mb-2">
            <span className="bg-secondary">Birthday</span>
            <input
              type="date"
              className={`input input-bordered bg-opacity-20 w-full`}
              onChange={(event) => inputHandler(event.target.value, 'birthday')}
            />
          </label>
          <label className="input-group max-w-xs mb-2">
            <span className="bg-secondary">Address</span>
            <input
              type="text"
              placeholder="123 Sesame Street"
              className={`input input-bordered bg-opacity-20 w-full ${
                errors.zip ? 'input-error' : ''
              }`}
              onChange={(event) => inputHandler(event.target.value, 'location')}
            />
          </label>
          <label className="input-group max-w-xs mb-2">
            <span className="bg-secondary whitespace-pre">I am</span>
            <select
              className="select select-bordered w-full max-w-xs bg-opacity-20"
              defaultValue="Gender"
              onChange={(event) => inputHandler(event.target.value, 'gender')}
            >
              <option disabled>Gender</option>
              <option>Female</option>
              <option>Male</option>
              <option>Non-binary</option>
            </select>
          </label>
          <label className="input-group max-w-xs mb-2">
            <span className="bg-secondary">Seeking</span>
            <select
              className="select select-bordered w-full max-w-xs bg-opacity-20"
              defaultValue="Gender"
              onChange={(event) =>
                inputHandler(event.target.value, 'seekGender')
              }
            >
              <option disabled>Gender</option>
              <option>Female</option>
              <option>Male</option>
              <option>Non-binary</option>
            </select>
          </label>
          <label className="input-group max-w-xs mb-2">
            <span className="bg-secondary">Seeking</span>
            <select
              className="select select-bordered w-full max-w-xs bg-opacity-20"
              defaultValue="Relationship Type"
              onChange={(event) =>
                inputHandler(event.target.value, 'seekRelationship')
              }
            >
              <option disabled>Relationship Type</option>
              <option>Serious</option>
              <option>Casual</option>
            </select>
          </label>
          <label className="input-group max-w-xs mb-2">
            <span className="bg-secondary w-1/4 ">Within</span>
            <input
              type="text"
              placeholder="10"
              className={`input input-bordered bg-opacity-20 w-1/2 ${
                errors.radius ? 'input-error' : ''
              }`}
              onChange={(event) =>
                inputHandler(event.target.value, 'seekRadius')
              }
            />
            <span className="bg-secondary w-1/4">Miles</span>
          </label>
          <label className="input-group max-w-xs mb-2">
            <span className="bg-secondary">Between</span>
            <input
              type="text"
              placeholder="18"
              className={`input input-bordered bg-opacity-20 w-3/4 ${
                errors.lowAge ? 'input-error' : ''
              }`}
              onChange={(event) =>
                inputHandler(event.target.value, 'seekAgeRangeLow')
              }
            />
            <span className="bg-secondary">and</span>
            <input
              type="text"
              placeholder="118"
              className={`input input-bordered bg-opacity-20 w-full ${
                errors.highAge ? 'input-error' : ''
              }`}
              onChange={(event) =>
                inputHandler(event.target.value, 'seekAgeRangeHigh')
              }
            />
          </label>
          <label htmlFor="upload-photo" className="mb-2">
            <input
              style={{ display: 'none' }}
              id="upload-photo"
              name="upload-photo"
              type="file"
              onChange={(event) => {
                //@ts-expect-error
                if (event.target.files) updateImage(event.target.files[0]);
              }}
            />
            <span className="btn btn-secondary" aria-label="add">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-camera"
                viewBox="0 0 16 16"
              >
                <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
                <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
              </svg>
              Add a Picture
            </span>
          </label>
          <button
            className="btn btn-secondary mb-2"
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

export default Signup;
