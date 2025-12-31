import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  className = '',
  type = 'button',
  ...props 
}) => {
  const variants = {
    primary: 'btn-teal',
    coral: 'btn-coral',
    solar: 'btn-solar',
    outline: 'btn-primary border-2 border-slate/20 hover:border-teal dark:border-dark-text/20',
    ghost: 'btn-primary bg-transparent hover:bg-slate/10 dark:hover:bg-dark-text/10'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
