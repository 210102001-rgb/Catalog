import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconClick?: () => void;
  variant?: 'default' | 'filled' | 'outlined';
  inputSize?: 'sm' | 'md' | 'lg';
}

export default function Input({
  label,
  error,
  success,
  hint,
  leftIcon,
  rightIcon,
  onRightIconClick,
  variant = 'default',
  inputSize = 'md',
  className = '',
  type = 'text',
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  };

  const variantClasses = {
    default: 'input',
    filled: 'input bg-gray-800 border-transparent focus:border-blue-500',
    outlined: 'input border-2 border-gray-700 focus:border-blue-500',
  };

  const getStateClasses = () => {
    if (error) return 'input-error';
    if (success) return 'input-success';
    return '';
  };

  const inputClasses = `
    ${variantClasses[variant]}
    ${sizeClasses[inputSize]}
    ${getStateClasses()}
    ${leftIcon ? 'pl-12' : ''}
    ${rightIcon || isPassword ? 'pr-12' : ''}
    ${className}
  `.trim();

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-white">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            <span className="material-symbols-outlined text-xl">
              {leftIcon}
            </span>
          </div>
        )}
        
        <input
          type={inputType}
          className={inputClasses}
          {...props}
        />
        
        {(rightIcon || isPassword) && (
          <button
            type="button"
            onClick={isPassword ? () => setShowPassword(!showPassword) : onRightIconClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-xl">
              {isPassword 
                ? (showPassword ? 'visibility_off' : 'visibility')
                : rightIcon
              }
            </span>
          </button>
        )}
      </div>
      
      {(error || success || hint) && (
        <div className="flex items-start gap-2 text-sm">
          {error && (
            <>
              <span className="material-symbols-outlined text-red-500 text-lg mt-0.5">
                error
              </span>
              <span className="text-red-500">{error}</span>
            </>
          )}
          
          {success && !error && (
            <>
              <span className="material-symbols-outlined text-green-500 text-lg mt-0.5">
                check_circle
              </span>
              <span className="text-green-500">{success}</span>
            </>
          )}
          
          {hint && !error && !success && (
            <>
              <span className="material-symbols-outlined text-gray-500 text-lg mt-0.5">
                info
              </span>
              <span className="text-gray-500">{hint}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Specialized input components
export function SearchInput({ 
  placeholder = "Cari...", 
  onSearch,
  className = '',
  ...props 
}: Omit<InputProps, 'leftIcon' | 'rightIcon'> & { onSearch?: (value: string) => void }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input
        leftIcon="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={className}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue('')}
          className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors duration-200"
        >
          <span className="material-symbols-outlined text-lg">
            close
          </span>
        </button>
      )}
    </form>
  );
}

export function TextArea({ 
  label,
  error,
  success,
  hint,
  className = '',
  rows = 4,
  ...props 
}: {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  className?: string;
  rows?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const getStateClasses = () => {
    if (error) return 'input-error';
    if (success) return 'input-success';
    return '';
  };

  const textareaClasses = `
    input resize-none
    ${getStateClasses()}
    ${className}
  `.trim();

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-white">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        rows={rows}
        className={textareaClasses}
        {...props}
      />
      
      {(error || success || hint) && (
        <div className="flex items-start gap-2 text-sm">
          {error && (
            <>
              <span className="material-symbols-outlined text-red-500 text-lg mt-0.5">
                error
              </span>
              <span className="text-red-500">{error}</span>
            </>
          )}
          
          {success && !error && (
            <>
              <span className="material-symbols-outlined text-green-500 text-lg mt-0.5">
                check_circle
              </span>
              <span className="text-green-500">{success}</span>
            </>
          )}
          
          {hint && !error && !success && (
            <>
              <span className="material-symbols-outlined text-gray-500 text-lg mt-0.5">
                info
              </span>
              <span className="text-gray-500">{hint}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}