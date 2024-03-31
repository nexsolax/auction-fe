import React from 'react';

const CountdownTimer = ({ daysRemaining, hoursRemaining, minutesRemaining, secondsRemaining }) => {
  return (
    <div>
      <div className="bg-white rounded-md border p-4">
        <div className="flex justify-between">
          <div className="text-center">
            <p className="text-2xl font-bold mb-1">{daysRemaining}</p>
            <p className="text-sm">Ngày</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold mb-1">{hoursRemaining}</p>
            <p className="text-sm">Giờ</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold mb-1">{minutesRemaining}</p>
            <p className="text-sm">Phút</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold mb-1">{secondsRemaining}</p>
            <p className="text-sm">Giây</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;