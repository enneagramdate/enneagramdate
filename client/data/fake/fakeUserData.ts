import axios from 'axios';
import { ActiveUser, RecommendedUser } from '../../types';

const usersArr: RecommendedUser[] = [];

for (let i = 1; i < 10; i += 1) {
  usersArr.push({
    elementId: i.toString(),
    enneagramType: i.toString(),
    name: `George #${i}`,
    age: 20 + i,
    imgUrl: [
      'https://www.fetchfind.com/blog/wp-content/uploads/2017/08/cat-2734999_1920-5-common-cat-sounds.jpg',
      'https://cdn.wallpapersafari.com/62/97/j7DWvq.jpg',
      'https://wallsdesk.com/wp-content/uploads/2018/03/Cat-High-Definition-Wallpapers-2.jpg',
    ],
  });
}

export default usersArr;
