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
      'https://miro.medium.com/v2/resize:fill:176:176/1*TzfP1ghe_d994dWtFWvaGg.jpeg',
      'https://clipart.info/images/minicovers/150368783867-dog-png-image-picture-download-dogs.png',
    ],
  });
}

export default usersArr;
