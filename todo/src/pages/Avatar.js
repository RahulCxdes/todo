import React from 'react';

const Avatar = ({ xp }) => {
  // Determine size based on XP
  const sizeClass = xp >= 100 ? 'w-24 h-24' : xp >= 50 ? 'w-20 h-20' : 'w-16 h-16';

  return (
    <div className="flex justify-center mb-6">
      <img
        src="/path/to/avatar.png"
        alt="Avatar"
        className={`rounded-full ${sizeClass} object-cover`}
      />
    </div>
  );
};

export default Avatar;
