import { User } from '../types';

const users: Map<string, User> = new Map();
const usersArr = [];

for (let i = 0; i < 10; i += 1) {
  usersArr.push({
    id: i.toString(),
    enneagramType: i.toString(),
    name: `George #${i}`,
    age: 20 + i,
    imgUrl: 'fake.png',
  });
}

usersArr.forEach((user) => {
  users.set(user.id, user);
});

export default users;

console.log(users);
