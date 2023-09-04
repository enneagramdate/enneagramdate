var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from 'react';
import { HiCheck, HiXMark } from 'react-icons/hi2';
import recsStore from '../stores/recsStore';
import userStore from '../stores/userStore';
import EnneagramBadge from './EnneagramBadge';
import axios from 'axios';
import matchesStore from '../stores/matchesStore';
const RecCard = (rec) => {
    const { elementId, enneagramType, name, age, imgUrl } = rec;
    const userId = userStore.use.elementId();
    const matches = matchesStore.use.matches();
    const setMatches = matchesStore.use.setMatches();
    const recs = recsStore.use.recs();
    const setRecs = recsStore.use.setRecs();
    const handleSwipe = (swipe, swipedUserId) => __awaiter(void 0, void 0, void 0, function* () {
        const route = swipe === 'like' ? '/api/likes' : '/api/dislikes';
        const body = {
            elementIdA: userId,
            elementIdB: swipedUserId,
        };
        const { data } = yield axios.post(route, body);
        console.log('here is the swipeResponse for A matches B', data.AmatchesB);
        console.log('here is the swipeResponse for A likes B', data.AlikesB);
        if (data.AmatchesB) {
            const matchesClone = [...matches, rec];
            setMatches(matchesClone);
            alert(`You just matched with ${name}!`);
        }
        const updatedRecsState = [...recs];
        updatedRecsState.pop();
        setRecs(updatedRecsState);
    });
    const images = imgUrl.map((url) => {
        return (React.createElement("div", { className: "carousel-item h-full", key: url },
            React.createElement("img", { src: url })));
    });
    return (React.createElement("div", { className: "card-container" },
        React.createElement("div", { className: "card w-96 bg-primary text-primary-content flex items-center justify-center" },
            React.createElement("div", { className: "h-8 bg-primary" }),
            React.createElement("div", { className: "h-96 carousel carousel-vertical" }, images),
            React.createElement("div", { className: "card-body" },
                React.createElement("div", { className: "rec-info flex flex-center justify-between items-center" },
                    React.createElement("div", { className: "card-title text-white text-md" }, `${name},\n\ ${age}`),
                    React.createElement("div", { className: "flex flex-end" },
                        React.createElement(EnneagramBadge, { enneagramType: enneagramType }))),
                React.createElement("div", { className: "card-actions flex flex-center space-x-48" },
                    React.createElement("button", { className: "btn btn-error btn-circle justify-left", onClick: () => handleSwipe('dislike', elementId) },
                        React.createElement(HiXMark, null)),
                    React.createElement("button", { className: "btn btn-success btn-circle justify-right", onClick: () => handleSwipe('like', elementId) },
                        React.createElement(HiCheck, null)))))));
};
export default RecCard;
//# sourceMappingURL=RecCard.js.map