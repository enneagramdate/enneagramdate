import React from 'react';
import { EnneagramType } from '../types';

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
    // <div className=`stat`>
    //   <div className="state-value">{enneagramType}</div>
    // </div>
  );
};

export default EnneagramBadge;
