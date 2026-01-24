import React from 'react';

interface ProductCardProps {
    name: string;
    type: string;
    status: string;
    statusColor: string;
    image: string;
    description: string;
    impressions: string;
    size: string;
    location: string;
    price: string;
    rating: number;
    onSelect?: () => void;
}

export default function ProductCard({
    name,
    type,
    status,
    statusColor,
    image,
    description,
    impressions,
    size,
    location,
    price,
    rating,
    onSelect,
}: ProductCardProps) {
    return (
        <div className="group flex flex-col bg-[#1a2633] rounded-2xl overflow-hidden border border-[#233648] hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(19,127,236,0.1)]">
            <div className="relative h-48 w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url("${image}")` }}
                ></div>
                <div className="absolute top-4 left-4 bg-[#111a22]/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-white border border-[#233648] uppercase tracking-widest">
                    {type}
                </div>
                <div
                    className={`absolute top-4 right-4 ${statusColor}/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-white shadow-lg uppercase tracking-widest`}
                >
                    {status}
                </div>
            </div>
            <div className="flex flex-col flex-1 p-6">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-white text-lg font-black leading-tight group-hover:text-primary transition-colors">
                        {name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[#92adc9] bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
                        <span className="material-symbols-outlined text-[16px] text-yellow-500 fill-current">star</span>
                        <span className="text-xs font-black">{rating}</span>
                    </div>
                </div>
                <p className="text-[#92adc9] text-sm mb-5 font-medium line-clamp-1 opacity-80">{description}</p>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6">
                    <div className="flex items-center gap-3 text-[#92adc9] text-sm font-bold">
                        <span className="material-symbols-outlined text-[20px] text-[#5a718a]">visibility</span>
                        <span>{impressions}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#92adc9] text-sm font-bold">
                        <span className="material-symbols-outlined text-[20px] text-[#5a718a]">aspect_ratio</span>
                        <span>{size}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#92adc9] text-sm font-bold col-span-2">
                        <span className="material-symbols-outlined text-[20px] text-[#5a718a]">pin_drop</span>
                        <span className="truncate">{location}</span>
                    </div>
                </div>
                <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-[#5a718a] font-black uppercase tracking-widest mb-1">Tarif Sewa</p>
                        <p className="text-white text-xl font-black">
                            {price}
                            <span className="text-xs font-normal text-[#92adc9] ml-1">/bulan</span>
                        </p>
                    </div>
                    <button
                        onClick={onSelect}
                        className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-black transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                    >
                        Pilih
                    </button>
                </div>
            </div>
        </div>
    );
}
