var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useState } from 'react';
import useUserStore from './stores/userStore';
import { useNavigate } from 'react-router-dom';
import { getUserData } from './data/utils';
import recsStore from './stores/recsStore';
import matchesStore from './stores/matchesStore';
const defaultInfo = {
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
    const user = useUserStore((state) => state);
    const setRecs = recsStore.use.setRecs();
    const setMatches = matchesStore.use.setMatches();
    const setMatchChats = matchesStore.use.setMatchChats();
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
    const inputHandler = (text, type) => {
        errorHandler(text, type);
        const curInfo = Object.assign({}, info);
        if (type === 'seekAgeRangeLow') {
            curInfo.seekAgeRange[0] = Number(text);
        }
        else if (type === 'seekAgeRangeHigh') {
            curInfo.seekAgeRange[1] = Number(text);
        }
        else if (type === 'seekRadius') {
            curInfo.seekRadius = Number(text);
        }
        else if (type === 'location') {
            const addArray = text.split(' ');
            curInfo.location = addArray.join('%20');
        }
        else
            curInfo[type] = text;
        updateInfo(curInfo);
    };
    const errorHandler = (text, type) => {
        const curErr = Object.assign({}, errors);
        curErr.alert = '';
        if (type === 'seekAgeRangeLow') {
            const age = Number(text);
            curErr.lowAge = !age || age < 18 || age > info.seekAgeRange[1];
            curErr.highAge = info.seekAgeRange[1] < age;
        }
        else if (type === 'seekAgeRangeHigh') {
            const age = Number(text);
            curErr.lowAge = info.seekAgeRange[0] < 18 || info.seekAgeRange[0] > age;
            curErr.highAge = !age || age < info.seekAgeRange[0];
        }
        else if (type === 'seekRadius') {
            curErr.radius = Number(text) < 1;
        }
        curErr.go = false;
        for (const [key, val] of Object.entries(info)) {
            if (!val ||
                (key === 'seekAgeRange' && (val[0] === 17 || val[1] === 16))) {
                curErr.go = true;
                break;
            }
        }
        if (curErr.email ||
            curErr.radius ||
            curErr.zip ||
            curErr.highAge ||
            curErr.lowAge)
            curErr.go = true;
        updateErrors(curErr);
    };
    const sender = () => __awaiter(void 0, void 0, void 0, function* () {
        if (image) {
            const formData = new FormData();
            if (image)
                formData.append('image', image);
            for (const [key, val] of Object.entries(info)) {
                formData.append(key, val);
            }
            const res = yield fetch('/api/signup/', {
                method: 'POST',
                body: formData,
            });
            const parseRes = yield res.json();
            if (res.ok) {
                const { properties, elementId, userRecs, userMatches, userMatchChats } = getUserData(parseRes);
                console.log('userRecs', userRecs);
                user.setUserState(properties, elementId);
                setRecs(userRecs);
                setMatches(userMatches);
                setMatchChats(userMatchChats);
                navigate('/recs');
            }
            else
                updateErrors(Object.assign(Object.assign({}, errors), { alert: parseRes.err }));
        }
        else {
            const res = yield fetch('/api/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'Application/JSON',
                },
                body: JSON.stringify(info),
            });
            const parseRes = yield res.json();
            if (res.ok) {
                const { properties, elementId, userRecs, userMatches, userMatchChats } = getUserData(parseRes);
                console.log('userRecs', userRecs);
                user.setUserState(properties, elementId);
                setRecs(userRecs);
                setMatches(userMatches);
                setMatchChats(userMatchChats);
                navigate('/recs');
            }
            else
                updateErrors(Object.assign(Object.assign({}, errors), { alert: parseRes.err }));
        }
    });
    const keyDownHandler = (e) => {
        if (e.code === '13' && !errors.go) {
            sender();
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "bg-primary text-primary-content text-white flex items-center justify-center h-full" },
            React.createElement("div", { className: "form-control w-full max-w-lg flex items-center justify-center" },
                React.createElement("label", { className: "input-group max-w-xs mb-2" },
                    React.createElement("span", { className: "bg-secondary" }, "Email"),
                    React.createElement("input", { type: "text", placeholder: "lover@wingman.com", className: `input input-bordered bg-opacity-20 w-full ${errors.email ? 'input-error' : ''}`, name: "email", onChange: (event) => inputHandler(event.target.value, 'email') })),
                React.createElement("label", { className: "input-group max-w-xs mb-2" },
                    React.createElement("span", { className: "bg-secondary" }, "Password"),
                    React.createElement("input", { type: "password", placeholder: "Shhh", className: "input input-bordered bg-opacity-20 w-full", onChange: (event) => inputHandler(event.target.value, 'password'), onKeyDown: keyDownHandler, name: "password" })),
                React.createElement("label", { className: "input-group max-w-xs mb-2" },
                    React.createElement("span", { className: "bg-secondary" }, "Name"),
                    React.createElement("input", { type: "text", placeholder: "Steve Harvey", className: `input input-bordered bg-opacity-20 w-full`, onChange: (event) => inputHandler(event.target.value, 'fullName'), name: "name" })),
                React.createElement("label", { className: "input-group max-w-xs mb-2" },
                    React.createElement("span", { className: "bg-secondary whitespace-pre" }, "Enneagram Type"),
                    React.createElement("select", { className: "select select-bordered w-full max-w-xs bg-opacity-20", defaultValue: "1-9", onChange: (event) => inputHandler(event.target.value, 'enneagramType'), name: "enneagramType" },
                        React.createElement("option", { disabled: true }, "1-9"),
                        React.createElement("option", null, "1"),
                        React.createElement("option", null, "2"),
                        React.createElement("option", null, "3"),
                        React.createElement("option", null, "4"),
                        React.createElement("option", null, "5"),
                        React.createElement("option", null, "6"),
                        React.createElement("option", null, "7"),
                        React.createElement("option", null, "8"),
                        React.createElement("option", null, "9"))),
                React.createElement("label", { className: "input-group max-w-xs mb-2" },
                    React.createElement("span", { className: "bg-secondary" }, "Birthday"),
                    React.createElement("input", { type: "date", className: `input input-bordered bg-opacity-20 w-full`, onChange: (event) => inputHandler(event.target.value, 'birthday'), name: "birthday" })),
                React.createElement("label", { className: "input-group max-w-xs mb-2" },
                    React.createElement("span", { className: "bg-secondary" }, "Address"),
                    React.createElement("input", { type: "text", placeholder: "123 Sesame Street", className: `input input-bordered bg-opacity-20 w-full ${errors.zip ? 'input-error' : ''}`, onChange: (event) => inputHandler(event.target.value, 'location'), name: "address" })),
                React.createElement("label", { className: "input-group max-w-xs mb-2" },
                    React.createElement("span", { className: "bg-secondary whitespace-pre" }, "I am"),
                    React.createElement("select", { className: "select select-bordered w-full max-w-xs bg-opacity-20", defaultValue: "Gender", onChange: (event) => inputHandler(event.target.value, 'gender'), name: "gender" },
                        React.createElement("option", { disabled: true }, "Gender"),
                        React.createElement("option", null, "Female"),
                        React.createElement("option", null, "Male"),
                        React.createElement("option", null, "Non-binary"))),
                React.createElement("label", { className: "input-group max-w-xs mb-2" },
                    React.createElement("span", { className: "bg-secondary" }, "Seeking"),
                    React.createElement("select", { className: "select select-bordered w-full max-w-xs bg-opacity-20", defaultValue: "Gender", onChange: (event) => inputHandler(event.target.value, 'seekGender'), name: "seeking-gender" },
                        React.createElement("option", { disabled: true }, "Gender"),
                        React.createElement("option", null, "Female"),
                        React.createElement("option", null, "Male"),
                        React.createElement("option", null, "Non-binary"))),
                React.createElement("label", { className: "input-group max-w-xs mb-2" },
                    React.createElement("span", { className: "bg-secondary" }, "Seeking"),
                    React.createElement("select", { className: "select select-bordered w-full max-w-xs bg-opacity-20", defaultValue: "Relationship Type", onChange: (event) => inputHandler(event.target.value, 'seekRelationship'), name: "relationship-type" },
                        React.createElement("option", { disabled: true }, "Relationship Type"),
                        React.createElement("option", null, "Serious"),
                        React.createElement("option", null, "Casual"))),
                React.createElement("label", { className: "input-group max-w-xs mb-2" },
                    React.createElement("span", { className: "bg-secondary w-1/4 " }, "Within"),
                    React.createElement("input", { type: "text", placeholder: "10", className: `input input-bordered bg-opacity-20 w-1/2 ${errors.radius ? 'input-error' : ''}`, onChange: (event) => inputHandler(event.target.value, 'seekRadius'), name: "radius" }),
                    React.createElement("span", { className: "bg-secondary w-1/4" }, "Miles")),
                React.createElement("label", { className: "input-group max-w-xs mb-2" },
                    React.createElement("span", { className: "bg-secondary" }, "Between"),
                    React.createElement("input", { type: "text", placeholder: "18", className: `input input-bordered bg-opacity-20 w-3/4 ${errors.lowAge ? 'input-error' : ''}`, onChange: (event) => inputHandler(event.target.value, 'seekAgeRangeLow'), name: "age-range-low" }),
                    React.createElement("span", { className: "bg-secondary" }, "and"),
                    React.createElement("input", { type: "text", placeholder: "118", className: `input input-bordered bg-opacity-20 w-full ${errors.highAge ? 'input-error' : ''}`, onChange: (event) => inputHandler(event.target.value, 'seekAgeRangeHigh'), name: "age-range-high" })),
                React.createElement("label", { htmlFor: "upload-photo", className: "mb-2" },
                    React.createElement("input", { style: { display: 'none' }, id: "upload-photo", name: "upload-photo", type: "file", onChange: (event) => {
                            if (event.target.files)
                                updateImage(event.target.files[0]);
                        } }),
                    React.createElement("span", { className: "btn btn-secondary", "aria-label": "add" },
                        React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-camera", viewBox: "0 0 16 16" },
                            React.createElement("path", { d: "M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" }),
                            React.createElement("path", { d: "M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" })),
                        "Add a Picture")),
                React.createElement("button", { className: "btn btn-secondary mb-2", disabled: errors.go, onClick: sender }, "Go!"),
                errors.alert && (React.createElement("div", { className: "alert alert-error" },
                    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "stroke-current shrink-0 h-6 w-6", fill: "none", viewBox: "0 0 24 24" },
                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" })),
                    React.createElement("span", null, errors.alert)))))));
};
export default Signup;
