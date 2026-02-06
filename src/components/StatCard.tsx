import React from 'react';

interface StatCardProps {
    icon: string;
    title: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    trendColor?: string;
    iconBgColor?: string;
    description?: string;
    loading?: boolean;
}

export default function StatCard({
    icon,
    title,
    value,
    trend,
    trendUp = true,
    trendColor = 'text-green-500',
    iconBgColor = 'bg-blue-500/10 text-blue-400',
    description,
    loading = false,
}: StatCardProps) {
    if (loading) {
        return (
            <div className="card p-6 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="skeleton w-12 h-12 rounded-xl" />
                    <div className="skeleton w-16 h-6 rounded-full" />
                </div>
                <div className="space-y-2">
                    <div className="skeleton w-24 h-4 rounded" />
                    <div className="skeleton w-20 h-8 rounded" />
                    <div className="skeleton w-32 h-3 rounded" />
                </div>
            </div>
        );
    }

    return (
        <article className="card card-hover group relative">
            <div className="p-6 space-y-4">
                {/* Header with Icon and Trend */}
                <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-xl ${iconBgColor} group-hover:scale-110 transition-all duration-300 hover-glow`}>
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {icon}
                        </span>
                    </div>
                    
                    {trend && (
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 ${trendColor}`}>
                            <span className={`material-symbols-outlined text-sm ${trendUp ? 'rotate-0' : 'rotate-180'} transition-transform duration-300`}>
                                trending_up
                            </span>
                            <span className="text-sm font-semibold">{trend}</span>
                        </div>
                    )}
                </div>
                
                {/* Content */}
                <div className="space-y-2">
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">
                        {title}
                    </h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-display-md text-white group-hover:text-blue-400 transition-colors duration-300">
                            {value}
                        </span>
                    </div>
                    {description && (
                        <p className="text-gray-500 text-sm leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
                
                {/* Progress Bar (Optional Enhancement) */}
                {trend && trendUp && (
                    <div className="pt-2">
                        <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: '75%' }}
                            />
                        </div>
                    </div>
                )}
            </div>
            
            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
        </article>
    );
}
