import React, { useEffect, useState } from 'react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export default function Toast({ 
  id, 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onClose(id), 300);
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'check_circle',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          iconColor: 'text-success',
          progressColor: 'bg-success',
        };
      case 'error':
        return {
          icon: 'error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          iconColor: 'text-error',
          progressColor: 'bg-error',
        };
      case 'warning':
        return {
          icon: 'warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          iconColor: 'text-warning',
          progressColor: 'bg-warning',
        };
      case 'info':
        return {
          icon: 'info',
          bgColor: 'bg-info/10',
          borderColor: 'border-info/20',
          iconColor: 'text-info',
          progressColor: 'bg-info',
        };
    }
  };

  const config = getTypeConfig();

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border backdrop-blur-md shadow-xl
        ${config.bgColor} ${config.borderColor}
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
        }
      `}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 ${config.iconColor}`}>
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              {config.icon}
            </span>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-text-primary font-semibold text-sm">
              {title}
            </h4>
            {message && (
              <p className="text-text-secondary text-sm mt-1 leading-relaxed">
                {message}
              </p>
            )}
          </div>
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-text-tertiary hover:text-text-primary transition-colors duration-200 p-1 rounded-lg hover:bg-surface-elevated"
          >
            <span className="material-symbols-outlined text-lg">
              close
            </span>
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-elevated">
          <div 
            className={`h-full ${config.progressColor} transition-all ease-linear`}
            style={{ 
              width: '100%',
              animation: `toast-progress ${duration}ms linear forwards`
            }}
          />
        </div>
      )}
    </div>
  );
}

// Toast Container Component
export function ToastContainer({ toasts }: { toasts: ToastProps[] }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}

// Toast Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: removeToast,
    };
    setToasts((prev) => [...prev, newToast]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (title: string, message?: string) => 
    addToast({ type: 'success', title, message });

  const error = (title: string, message?: string) => 
    addToast({ type: 'error', title, message });

  const warning = (title: string, message?: string) => 
    addToast({ type: 'warning', title, message });

  const info = (title: string, message?: string) => 
    addToast({ type: 'info', title, message });

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}

// CSS for progress bar animation (add to globals.css)
const toastStyles = `
@keyframes toast-progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
`;