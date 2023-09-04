import React from 'react';
import { setTypeTextColor } from '../data/utils';
const EnneagramBadge = ({ enneagramType, }) => {
    const textColor = setTypeTextColor(enneagramType);
    return (React.createElement("div", { className: `stat bg-${enneagramType} rounded-full w-20 h-20 flex justify-center items-center` },
        React.createElement("div", { className: `stat-value ${textColor}` }, enneagramType)));
};
export default EnneagramBadge;
