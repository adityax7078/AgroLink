import React from 'react';

/**
 * Button component for user actions.
 * 
 * @param {Object} props - The component props.
 * @param {'primary' | 'secondary' | 'outline'} [props.variant='primary'] - Visual style of the button.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Size of the button.
 * @param {boolean} [props.disabled=false] - If true, the button will be disabled and non-interactive.
 * @param {Function} [props.onClick] - Callback function executed when button is clicked.
 * @param {React.ReactNode} props.children - The content to be rendered inside the button.
 * @param {string} [props.className=''] - Custom Tailwind CSS classes to merge or override styles.
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - The HTML type attribute for the button.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
  className = '',
  type = 'button',
  ...rest
}) {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99] shadow-sm';
  
  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 border border-transparent',
    secondary: 'bg-slate-600 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600 border border-transparent',
    outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/50 dark:hover:border-slate-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4.5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
