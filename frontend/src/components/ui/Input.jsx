import React from 'react';

/**
 * Input component for form fields.
 * 
 * @param {Object} props - The component props.
 * @param {string} [props.label] - Optional label text shown above the input field.
 * @param {string} [props.placeholder] - Placeholder text for empty state.
 * @param {string} [props.type='text'] - HTML input type (e.g. text, password, number, email).
 * @param {string|number} [props.value] - The current input value controlled by React state.
 * @param {Function} [props.onChange] - Change handler invoked when input text is modified.
 * @param {string} [props.error] - Validation error message to render beneath the field.
 * @param {string} [props.className=''] - Custom Tailwind CSS classes to style the container.
 * @param {string} [props.id] - Unique identifier for labels and form field bindings.
 */
export function Input({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  className = '',
  id,
  ...rest
}) {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 11)}`;

  return (
    <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-sm font-semibold text-slate-600 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
            : 'border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20'
        }`}
        {...rest}
      />
      {error && (
        <span className="text-xs font-semibold text-red-500 dark:text-red-400">
          {error}
        </span>
      )}
    </div>
  );
}
