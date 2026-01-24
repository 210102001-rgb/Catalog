import React from 'react';

interface StatCardProps {
    icon: string;
    title: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    trendColor?: string;
    iconBgColor?: string;
}

export default function StatCard({
    icon,
    title,
    value,
    trend,
    trendUp,
    trendColor = 'text-green-400',
    iconBgColor = 'bg-primary/20 text-primary',
}: StatCardProps) {
    return (
        <div className="bg-[#233648] rounded-xl p-6 flex flex-col gap-4 border border-white/5 hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start">
                <div className={`p-2 rounded-lg ${iconBgColor}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                {trend && (
                    <span className={`text-sm font-medium flex items-center gap-1 ${trendColor}`}>
                        {trendUp !== false && <span className="material-symbols-outlined text-sm">trending_up</span>}
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-text-secondary text-sm font-medium">{title}</p>
                <h3 className="text-white text-2xl font-bold mt-1">{value}</h3>
            </div>
        </div>
    );
}
