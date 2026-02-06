import React from "react";

interface ProductCardProps {
  name: string;
  type: string;
  status: string;
  statusColor: string;
  image?: string;
  images?: string[];
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
  images, 
  description, 
  impressions, 
  size, 
  location, 
  price, 
  rating, 
  onSelect 
}: ProductCardProps) {
  const imageUrl = image || (images && images.length > 0 ? images[0] : "");
  
  return (
    <article className="group bg-[#1a2633] border border-[#324d67] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/50 relative flex flex-col h-full">
      {/* Image Container with Enhanced Overlay */}
      <div className="relative h-48 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
          style={{ backgroundImage: `url("${imageUrl}")` }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2633] to-transparent opacity-80" />
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-[#111a22]/80 backdrop-blur-sm border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            {type}
          </span>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border backdrop-blur-sm ${
            status === 'Tersedia' 
              ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
              : 'bg-red-500/20 border-red-500/30 text-red-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'Tersedia' ? 'bg-emerald-400' : 'bg-red-400'}`} />
            {status}
          </span>
        </div>
        
        {/* Price Tag Overlay */}
         <div className="absolute bottom-3 right-3">
          <div className="bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-lg">
             <span className="text-white text-xs font-bold">{price}</span>
          </div>
        </div>
      </div>
      
      {/* Content Container */}
      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#111a22] border border-[#324d67]">
            <span className="material-symbols-outlined text-blue-400 text-[18px]">visibility</span>
            <div className="min-w-0">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider truncate">Impressions</p>
              <p className="text-white text-xs font-bold truncate">{impressions}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#111a22] border border-[#324d67]">
            <span className="material-symbols-outlined text-green-400 text-[18px]">aspect_ratio</span>
            <div className="min-w-0">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider truncate">Ukuran</p>
              <p className="text-white text-xs font-bold truncate">{size}</p>
            </div>
          </div>
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-2 text-gray-400 pt-2 border-t border-[#324d67]">
          <span className="material-symbols-outlined text-[16px]">location_on</span>
          <span className="text-xs truncate">{location}</span>
        </div>

        {/* Action Button */}
        <button 
          onClick={onSelect}
          className="w-full bg-primary hover:bg-blue-600 text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all mt-2"
        >
          Lihat Detail
        </button>
      </div>
    </article>
  );
}

// Helper functions for status styling
function getStatusBadgeClass(status: string): string {
  switch (status.toUpperCase()) {
    case 'APPROVED':
      return 'badge-success';
    case 'PENDING_APPROVAL':
    case 'PENDING':
      return 'badge-warning';
    case 'REJECTED':
      return 'badge-error';
    case 'DRAFT':
      return 'badge-primary';
    default:
      return 'badge-primary';
  }
}

function getStatusDotClass(status: string): string {
  switch (status.toUpperCase()) {
    case 'APPROVED':
      return 'bg-green-500';
    case 'PENDING_APPROVAL':
    case 'PENDING':
      return 'bg-yellow-500';
    case 'REJECTED':
      return 'bg-red-500';
    case 'DRAFT':
      return 'bg-blue-400';
    default:
      return 'bg-blue-400';
  }
}
