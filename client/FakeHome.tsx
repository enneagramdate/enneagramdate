import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const generateFakeUsers = (index: number) => {
  const isMale = index % 2 === 0 ? true : false;
  let gender;
  let seekGender;
  if (isMale) {
    gender = 'male';
    seekGender = 'female';
  } else {
    gender = 'female';
    seekGender = 'male';
  }
  const getRandomType = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
  };
  const enneagramType = getRandomType(1, 9);
  return {
    email: `test-${index}@gmail.com`,
    password: `${index}_password`,
    fullName: `User-${index}`,
    enneagramType: isMale ? 8 : 2,
    birthday: '1990-01-01',
    seekAgeRange: [18, 100],
    gender: `${gender}`,
    seekGender: `${seekGender}`,
    seekRelationship: 'life partner',
    location: [33.791508469594, -84.40040281008906],
    seekRadius: 200,
  };
};

const populateDB = async () => {
  for (let i = 0; i < 4; i += 1) {
    const body = generateFakeUsers(i);
    await axios.post('/api/signup', body);
  }
};

const handleClick = async () => {
  populateDB();
};

const FakeHome = () => {
  const navigate = useNavigate();
  return (
    <>
      <button className="btn btn-primary" onClick={() => navigate('/recs')}>
        Click to go to /recs
      </button>
      <button className="btn btn-info" onClick={handleClick}>
        Click to generate fake users
      </button>
    </>
  );
};

export default FakeHome;
