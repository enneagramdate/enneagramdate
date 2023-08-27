import React from 'react';
import { EnneagramType } from '../types';
// ! this is weird, but given the way tailwind compiles, the dynamic color classes won't load properly unless this is imported
// ! see: https://www.codeconcisely.com/posts/tailwind-css-dynamic-class/
import { colorWorkaround } from '../data/utils';

const EnneagramBadge = ({
  enneagramType,
}: {
  enneagramType: EnneagramType;
}) => {
  return (
    <div
      className={`stat bg-${enneagramType} rounded-full w-20 h-20 flex justify-center items-center`}
    >
      <div className="stat-value">{enneagramType}</div>
    </div>
  );
};

export default EnneagramBadge;

/* 
      9: '#EC50B6',
      8: '#CF0010',
      7: '#F8A400',
      6: '#FBD504',
      5: '#78CD34',
      4: '#32A75F',
      3: '#329F9D',
      2: '#21669E',
      1: '#2826A7',
*/
