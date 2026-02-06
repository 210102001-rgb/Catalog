import React from 'react';
import Modal from '../../ui/Modal';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    itemName?: string;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, title, message, itemName }: DeleteModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
            <div className="space-y-6">
                {/* Enhanced Warning Icon */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                        </div>
                        {/* Pulse effect */}
                        <div className="absolute inset-0 w-20 h-20 rounded-full bg-red-500/5 animate-ping"></div>
                    </div>
                </div>
                
                {/* Enhanced Content */}
                <div className="text-center space-y-3">
                    <div className="space-y-2">
                        <p className="text-gray-300 text-base leading-relaxed">
                            {message} {itemName && (
                                <span className="font-semibold text-white bg-gray-800 px-2 py-1 rounded-md">
                                    "{itemName}"
                                </span>
                            )}?
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Tindakan ini tidak dapat dibatalkan</span>
                        </div>
                    </div>
                </div>
                
                {/* Enhanced Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-sm font-semibold text-gray-300 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 hover:border-gray-600 transition-all duration-200 flex items-center justify-center gap-2 min-w-[120px]"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Batal
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-6 py-3 text-sm font-semibold text-white bg-red-600 border border-red-500 rounded-xl hover:bg-red-700 hover:border-red-600 transition-all duration-200 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 flex items-center justify-center gap-2 min-w-[120px] hover:scale-105 active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Hapus
                    </button>
                </div>
            </div>
        </Modal>
    );
}
