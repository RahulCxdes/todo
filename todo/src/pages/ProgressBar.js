import React from 'react';
import PropTypes from 'prop-types';
import lean from '../assets/lean.png';
import inter from '../assets/inter.jpg';
import final from '../assets/final.png';

const ProgressBar = ({ xp }) => {
  const maxXP = 5000; // Maximum XP value for the progress bar
  const progress = (xp / maxXP) * 100; // Calculate progress percentage

  // Determine avatar image to show based on XP
  let avatarStyle;
  if (xp >= 5000) {
    avatarStyle = { backgroundImage: `url(${final})` };
  } else if (xp >= 1000) {
    avatarStyle = { backgroundImage: `url(${inter})` };
  } else {
    avatarStyle = { backgroundImage: `url(${lean})` };
  }

  return (
    <div className="relative w-full flex items-center justify-center">
      {/* Start Image */}
      <div className="absolute left-0 -ml-10 top-1/2 transform -translate-y-1/2">
        <img src={lean} alt="Lean Man" className="w-12 h-12" />
      </div>

      {/* Progress Bar */}
      <div className="relative flex-grow bg-gray-200 rounded-full h-8 overflow-hidden">
        <div
          className="absolute top-0 left-0 h-8 rounded-full bg-blue-500"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-8">
          <div
            className="w-12 h-12 bg-center bg-no-repeat bg-cover"
            style={{
              ...avatarStyle,
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />
        </div>
      </div>

      {/* End Image */}
      <div className="absolute right-0 -mr-10 top-1/2 transform -translate-y-1/2">
        <img src={final} alt="Final Man" className="w-12 h-12" />
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  xp: PropTypes.number.isRequired,
};

export default ProgressBar;
