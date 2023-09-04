var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Client } from '@googlemaps/google-maps-services-js';
import 'dotenv/config';
const client = new Client({});
const addressToPos = (zip) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('in address to POS', process.env.GOOGLE_MAPS);
    const response = yield client.geocode({
        params: {
            address: zip,
            key: process.env.GOOGLE_MAPS,
        },
    });
    if (response.data.status === 'OK') {
        return response.data.results[0].geometry.location;
    }
    else {
        throw new Error('Problem getting user location');
    }
});
const dictionary = new Map();
dictionary.set('1', new Set(['2', '5', '7']));
dictionary.set('2', new Set(['1', '8', '9']));
dictionary.set('3', new Set(['6', '9']));
dictionary.set('4', new Set(['5', '6', '9']));
dictionary.set('5', new Set(['1', '4', '8']));
dictionary.set('6', new Set(['3', '4', '7', '9']));
dictionary.set('7', new Set(['1', '6', '8']));
dictionary.set('8', new Set(['2', '5', '7']));
dictionary.set('9', new Set(['2', '3', '4', '6']));
function getAge(date) {
    var today = new Date();
    var birthDate = new Date(date);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
export { addressToPos, dictionary, getAge };
//# sourceMappingURL=utils.js.map