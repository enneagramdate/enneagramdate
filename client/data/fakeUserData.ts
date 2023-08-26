import { User } from '../types';

const usersArr: User[] = [];

for (let i = 0; i < 10; i += 1) {
  usersArr.push({
    id: i.toString(),
    enneagramType: i.toString(),
    name: `George #${i}`,
    age: 20 + i,
    imgUrl: [
      'https://purrfectcatbreeds.com/wp-content/uploads/2014/06/abyssinian-main.jpg',
    ],
  });
}

export default usersArr;
