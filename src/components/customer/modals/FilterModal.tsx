import React, { useState } from 'react';
import Modal from '../../ui/Modal';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: FilterState) => void;
    initialFilters?: FilterState;
}

export interface FilterState {
    priceMin: number;
    priceMax: number;
    types: string[];
    city: string;
}

export default function FilterModal({ isOpen, onClose, onApply, initialFilters }: FilterModalProps) {
    const [filters, setFilters] = useState<FilterState>(initialFilters || {
        priceMin: 5000000,
        priceMax: 100000000,
        types: [],
        city: '',
    });

    const toggleType = (type: string) => {
        setFilters(prev => ({
            ...prev,
            types: prev.types.includes(type)
                ? prev.types.filter(t => t !== type)
                : [...prev.types, type]
        }));
    };

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const handleReset = () => {
        const defaultFilters = {
            priceMin: 5000000,
            priceMax: 100000000,
            types: [],
            city: '',
        };
        setFilters(defaultFilters);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Filter Papan Reklame"
        >
            <div className="space-y-6">
                {/* Price */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider">Rentang Harga</h3>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <div className="flex justify-between text-white text-xs font-medium mb-4">
                            <span>Rp {(filters.priceMin / 1000000).toFixed(0)}jt</span>
                            <span>Rp {(filters.priceMax / 1000000).toFixed(0)}jt+</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="200000000"
                            step="5000000"
                            value={filters.priceMin}
                            onChange={(e) => setFilters(prev => ({ ...prev, priceMin: parseInt(e.target.value) }))}
                            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full"
                        />
                        <p className="text-center text-[#92adc9] text-xs mt-3">
                            Rp {(filters.priceMin / 1000000).toFixed(1)}jt - Rp {(filters.priceMax / 1000000).toFixed(1)}jt / bulan
                        </p>
                    </div>
                </div>

                {/* Type */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider">Tipe Papan</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {['Digital', 'Statis', 'LED', 'Videotron'].map((type) => (
                            <label key={type} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                filters.types.includes(type)
                                    ? 'bg-primary/20 border-primary'
                                    : 'bg-white/5 border-white/5 hover:border-primary/50'
                            }`}>
                                <input
                                    type="checkbox"
                                    checked={filters.types.includes(type)}
                                    onChange={() => toggleType(type)}
                                    className="w-5 h-5 rounded border-[#5a718a] bg-[#111a22] text-primary focus:ring-0"
                                />
                                <span className={`text-sm font-medium ${filters.types.includes(type) ? 'text-primary' : 'text-[#92adc9]'}`}>{type}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* City */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider">Kota</h3>
                    <div className="relative">
                        <select
                            value={filters.city}
                            onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full bg-[#111a22] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                        >
                            <option value="">Semua Kota</option>
                            <option value="jakarta">Jakarta</option>
                            <option value="surabaya">Surabaya</option>
                            <option value="bandung">Bandung</option>
                            <option value="medan">Medan</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#5a718a] pointer-events-none">expand_more</span>
                    </div>
                </div>

                <div className="pt-6">
                    <button
                        className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg"
                        onClick={handleApply}
                    >
                        Terapkan Filter
                    </button>
                    <button
                        className="w-full mt-3 text-sm text-[#92adc9] hover:text-white font-medium py-2 transition-colors"
                        onClick={handleReset}
                    >
                        Atur Ulang
                    </button>
                </div>
            </div>
        </Modal>
    );
}
