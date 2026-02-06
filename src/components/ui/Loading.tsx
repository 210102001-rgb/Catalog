import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export default function Loading({ 
  size = 'md', 
  variant = 'spinner', 
  text, 
  fullScreen = false,
  className = '' 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const containerClass = fullScreen 
    ? 'fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center';

  const renderSpinner = () => (
    <div className={`loading-spinner ${sizeClasses[size]} ${className}`} />
  );

  const renderDots = () => (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`bg-blue-500 rounded-full animate-pulse ${
            size === 'sm' ? 'w-2 h-2' : 
            size === 'md' ? 'w-3 h-3' : 
            size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'
          }`}
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div className={`bg-blue-500/20 rounded-full animate-ping ${sizeClasses[size]}`}>
      <div className={`bg-blue-500 rounded-full ${sizeClasses[size]} animate-pulse`} />
    </div>
  );

  const renderSkeleton = () => (
    <div className="space-y-3 w-full max-w-sm">
      <div className="skeleton h-4 rounded" />
      <div className="skeleton h-4 rounded w-5/6" />
      <div className="skeleton h-4 rounded w-4/6" />
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'skeleton':
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-4">
        {renderLoader()}
        {text && (
          <p className="text-gray-400 text-sm font-medium animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  );
}

// Specialized loading components
export function PageLoading({ text = "Memuat halaman..." }: { text?: string }) {
  return <Loading variant="spinner" size="lg" text={text} fullScreen />;
}

export function ButtonLoading({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return <Loading variant="spinner" size={size} />;
}

export function CardLoading() {
  return (
    <div className="card p-6">
      <Loading variant="skeleton" />
    </div>
  );
}

export function TableLoading({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="skeleton w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 rounded w-3/4" />
            <div className="skeleton h-3 rounded w-1/2" />
          </div>
          <div className="skeleton w-20 h-8 rounded" />
        </div>
      ))}
    </div>
  );
}