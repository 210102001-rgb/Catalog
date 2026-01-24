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
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-4">
                <p className="text-slate-600 dark:text-slate-300">
                    {message} {itemName && <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span>}?
                </p>
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
                    >
                        Hapus
                    </button>
                </div>
            </div>
        </Modal>
    );
}
