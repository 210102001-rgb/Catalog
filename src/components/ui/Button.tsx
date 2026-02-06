import React from 'react';
import { ButtonLoading } from './Loading';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'btn hover-scale';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30',
    success: 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-lg shadow-yellow-500/25 hover:shadow-xl hover:shadow-yellow-500/30',
  };

  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
    xl: 'btn-xl',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <ButtonLoading size={size === 'sm' ? 'sm' : 'md'} />
          <span>Memuat...</span>
        </>
      ) : (
        <>
          {leftIcon && (
            <span className="material-symbols-outlined text-current">
              {leftIcon}
            </span>
          )}
          {children}
          {rightIcon && (
            <span className="material-symbols-outlined text-current">
              {rightIcon}
            </span>
          )}
        </>
      )}
    </button>
  );
}

// Specialized button variants
export function IconButton({ 
  icon, 
  variant = 'ghost', 
  size = 'md',
  className = '',
  ...props 
}: Omit<ButtonProps, 'children'> & { icon: string }) {
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
    xl: 'p-5',
  };

  return (
    <Button
      variant={variant}
      className={`${sizeClasses[size]} ${className}`}
      {...props}
    >
      <span className="material-symbols-outlined">
        {icon}
      </span>
    </Button>
  );
}

export function FloatingActionButton({ 
  icon, 
  className = '',
  ...props 
}: Omit<ButtonProps, 'children' | 'variant' | 'size'> & { icon: string }) {
  return (
    <button
      className={`fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-110 z-40 ${className}`}
      {...props}
    >
      <span className="material-symbols-outlined text-2xl">
        {icon}
      </span>
    </button>
  );
}