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
import isEmail from 'validator/lib/isEmail';
import { useNavigate } from 'react-router-dom';
import recsStore from './stores/recsStore';
import matchesStore from './stores/matchesStore';
import { getUserData } from './data/utils';
const Login = () => {
    const user = useUserStore((state) => state);
    const navigate = useNavigate();
    const setRecs = recsStore.use.setRecs();
    const setMatches = matchesStore.use.setMatches();
    const setMatchChats = matchesStore.use.setMatchChats();
    const [info, updateInfo] = useState({
        email: '',
        password: '',
    });
    const [errors, updateErrors] = useState({
        email: false,
        go: true,
        alert: '',
    });
    const inputHandler = (text, type) => {
        errorHandler(text, type);
        const curInfo = Object.assign({}, info);
        curInfo[type] = text;
        updateInfo(curInfo);
    };
    const errorHandler = (text, type) => {
        const curErr = Object.assign({}, errors);
        curErr.alert = '';
        if (type === 'email') {
            curErr.email = !isEmail(text);
        }
        curErr.go = false;
        for (const [key, val] of Object.entries(info)) {
            if (val === '') {
                curErr.go = true;
                break;
            }
        }
        if (curErr.email)
            curErr.go = true;
        updateErrors(curErr);
    };
    const sender = () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield fetch('/api/', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/JSON',
            },
            body: JSON.stringify(info),
        });
        const parseRes = yield res.json();
        if (res.ok) {
            const { properties, elementId, userRecs, userMatches, userMatchChats } = getUserData(parseRes);
            user.setUserState(properties, elementId);
            setRecs(userRecs);
            setMatches(userMatches);
            setMatchChats(userMatchChats);
            navigate('/recs');
        }
        else
            updateErrors(Object.assign(Object.assign({}, errors), { alert: parseRes.err }));
    });
    const keyDownHandler = (e) => {
        if (e.code === 'Enter' && !errors.go) {
            sender();
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "bg-primary text-primary-content flex items-center justify-center h-full" },
            React.createElement("div", { className: "form-control w-full max-w-xs" },
                React.createElement("label", { className: "input-group text-white w-full mb-4" },
                    React.createElement("span", { className: "bg-secondary" }, "Email"),
                    React.createElement("input", { type: "text", placeholder: "lover@wingman.com", className: `input input-bordered bg-opacity-20 w-full ${errors.email ? 'input-error' : ''}`, name: "email", onChange: (event) => inputHandler(event.target.value, 'email') })),
                React.createElement("label", { className: "input-group text-white mb-4" },
                    React.createElement("span", { className: "bg-secondary" }, "Password"),
                    React.createElement("input", { type: "password", placeholder: "Shhh", className: "input input-bordered bg-opacity-20 w-full", onChange: (event) => inputHandler(event.target.value, 'password'), onKeyDown: keyDownHandler, name: "password" })),
                React.createElement("button", { className: "btn btn-secondary mb-4", disabled: errors.go, onClick: sender }, "Go!"),
                errors.alert && (React.createElement("div", { className: "alert alert-error" },
                    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "stroke-current shrink-0 h-6 w-6", fill: "none", viewBox: "0 0 24 24" },
                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" })),
                    React.createElement("span", null, errors.alert)))))));
};
export default Login;
