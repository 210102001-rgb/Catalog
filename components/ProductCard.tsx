import React from 'react'

export default function ProductCard({ title, type, area, impressions, dimensions, price, status, image }: any) {
  return (
    <div className="group flex flex-col bg-[#1a2633] rounded-xl overflow-hidden border border-[#233648] hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(19,127,236,0.1)]">
      <div className="relative h-48 w-full overflow-hidden" style={{backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute top-3 left-3 bg-[#111a22]/90 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-bold text-white border border-[#233648]">{type.toUpperCase()}</div>
        <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-bold text-white shadow-sm">{status.toUpperCase()}</div>
      </div>
      <div className="flex flex-col flex-1 p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-white text-lg font-bold leading-tight group-hover:text-primary transition-colors">{title}</h3>
          <div className="flex items-center gap-1 text-[#92adc9]"><span className="material-symbols-outlined text-[16px]">star</span><span className="text-xs font-medium">4.8</span></div>
        </div>
        <p className="text-[#92adc9] text-sm mb-4 line-clamp-1">{area} • {impressions}</p>
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-5">
          <div className="flex items-center gap-2 text-[#92adc9] text-sm"><span className="material-symbols-outlined text-[18px] text-[#5a718a]">visibility</span><span>{impressions}</span></div>
          <div className="flex items-center gap-2 text-[#92adc9] text-sm"><span className="material-symbols-outlined text-[18px] text-[#5a718a]">aspect_ratio</span><span>{dimensions}</span></div>
          <div className="flex items-center gap-2 text-[#92adc9] text-sm"><span className="material-symbols-outlined text-[18px] text-[#5a718a]">pin_drop</span><span>{area}</span></div>
        </div>
        <div className="mt-auto pt-4 border-t border-[#233648] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#5a718a] font-medium uppercase">Tarif</p>
            <p className="text-white text-lg font-bold">{price}<span className="text-sm font-normal text-[#92adc9]">/bulan</span></p>
          </div>
          <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-500/20">Pilih</button>
        </div>
      </div>
    </div>
  )
}
