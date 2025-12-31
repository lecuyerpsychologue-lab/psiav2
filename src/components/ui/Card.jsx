import React from 'react';

const Card = ({ children, className = '', onClick, ...props }) => {
  return (
    <div
      className={`glass-card p-6 ${onClick ? 'cursor-pointer hover:scale-105 transition-transform duration-200' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
