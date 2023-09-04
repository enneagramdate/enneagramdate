var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
const generateFakeUsers = (index) => {
    const isMale = index % 2 === 0 ? true : false;
    const serOrCas = index % 3 === 0 ? 'serious' : 'casual';
    let gender;
    let seekGender;
    if (isMale) {
        gender = 'male';
        seekGender = 'female';
    }
    else {
        gender = 'female';
        seekGender = 'male';
    }
    const getRandomType = (min, max) => {
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
export const populateDB = () => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 51; i < 100; i += 1) {
        const body = generateFakeUsers(i);
        yield axios.post('/api/signup', body);
    }
});
