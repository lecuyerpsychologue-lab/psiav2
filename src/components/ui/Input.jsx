import React from 'react';

const Input = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  className = '',
  error,
  ...props 
}) => {
  return (
    <div className="w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input-field ${error ? 'border-coral' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-coral">{error}</p>
      )}
    </div>
  );
};

export default Input;
