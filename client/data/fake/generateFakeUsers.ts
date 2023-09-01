import axios from 'axios';

const generateFakeUsers = (index: number) => {
  const isMale = index % 2 === 0 ? true : false;
  const serOrCas = index % 3 === 0 ? 'serious' : 'casual';
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
    fullName: `${index}`,
    enneagramType: getRandomType(1, 9),
    birthday: '1990-01-01',
    seekAgeRange: [18, 100],
    gender: `${gender}`,
    seekGender: `${seekGender}`,
    seekRelationship: 'Casual',
    location: '24 Sussex Drive Ottawa ON',
    seekRadius: 200,
  };
};

export const populateDB = async () => {
  for (let i = 51; i < 100; i += 1) {
    const body = generateFakeUsers(i);
    await axios.post('/api/signup', body);
  }
};

// const handleClick = async () => {
//   populateDB();
// };

// const FakeHome = () => {
//   const navigate = useNavigate();
//   return (
//     <>
//       <button className="btn btn-primary" onClick={() => navigate('/recs')}>
//         Click to go to /recs
//       </button>
//       <button className="btn btn-info" onClick={handleClick}>
//         Click to generate fake users
//       </button>
//       <NavBar />
//     </>
//   );
// };

// export default FakeHome;
