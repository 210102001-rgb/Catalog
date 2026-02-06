import React from 'react';

interface HeaderProps {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
    className?: string;
    breadcrumbs?: Array<{ label: string; href?: string }>;
    actions?: React.ReactNode;
}

export default function Header({ 
    title, 
    subtitle, 
    children, 
    className = "", 
    breadcrumbs,
    actions 
}: HeaderProps) {
    return (
        <header className={`md:sticky md:top-0 z-30 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 ${className}`}>
            <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-3 md:py-4">
                {/* Breadcrumbs - Ultra Compact for Mobile */}
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <nav className="flex items-center gap-1 mb-1 sm:mb-2 overflow-x-auto scrollbar-hide" aria-label="Breadcrumb">
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={index}>
                                {index > 0 && (
                                    <span className="text-gray-500 text-xs flex-shrink-0">
                                        /
                                    </span>
                                )}
                                {crumb.href ? (
                                    <a 
                                        href={crumb.href}
                                        className="text-gray-400 hover:text-blue-400 text-xs font-medium transition-colors duration-200 whitespace-nowrap"
                                    >
                                        {crumb.label}
                                    </a>
                                ) : (
                                    <span className="text-white text-xs font-semibold whitespace-nowrap">
                                        {crumb.label}
                                    </span>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                )}
                
                {/* Main Header Content - Ultra Compact Mobile */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                    {/* Title Section - Mobile Optimized */}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 sm:gap-2">
                            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-bold tracking-tight truncate">
                                {title}
                            </h1>
                            
                            {/* Ultra Compact Live indicator */}
                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full flex-shrink-0">
                                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-green-500 text-xs font-medium hidden md:inline">Live</span>
                            </div>
                        </div>
                        
                        {subtitle && (
                            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mt-0.5 line-clamp-1 sm:line-clamp-2">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    
                    {/* Actions Section - Mobile Compact */}
                    {(children || actions) && (
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 overflow-x-auto scrollbar-hide">
                            {actions}
                            {children}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Subtle Border Effect */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        </header>
    );
}
