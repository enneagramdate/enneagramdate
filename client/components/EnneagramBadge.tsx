import React from 'react';
import { EnneagramType } from '../types';
import { setTypeTextColor } from '../data/utils';

const EnneagramBadge = ({
  enneagramType,
}: {
  enneagramType: EnneagramType;
}) => {
  const textColor = setTypeTextColor(enneagramType);
  return (
    <div
      className={`stat bg-${enneagramType} rounded-full w-20 h-20 flex justify-center items-center`}
    >
      <div className={`stat-value ${textColor}`}>{enneagramType}</div>
    </div>
  );
};

export default EnneagramBadge;
