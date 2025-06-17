import React, { useState, useEffect } from 'react';
import { X, Calendar, FileText } from 'lucide-react';
import type { Card } from '../types';

interface CardModalProps {
    card: Card;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedCard: Card) => void;
    onDelete: () => void;
}

export const CardModal: React.FC<CardModalProps> = ({
    card,
    isOpen,
    onClose,
    onSave,
    onDelete,
}) => {
    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(card.description || '');
    const [dueDate, setDueDate] = useState(card.dueDate || '');

    useEffect(() => {
        setTitle(card.title);
        setDescription(card.description || '');
        setDueDate(card.dueDate || '');
    }, [card]);

    const handleSave = () => {
        onSave({
            ...card,
            title,
            description,
            dueDate,
        });
        onClose();
    };

    const handleDelete = () => {
        onDelete();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-20 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">

            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto transform transition-transform duration-300 scale-100">

                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Edit Card</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter card title..."
                        />
                    </div>

                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <FileText className="w-4 h-4 mr-2" />
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            placeholder="Add a description..."
                        />
                    </div>

                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 mr-2" />
                            Due Date
                        </label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between p-6 border-t border-gray-200">
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                        Delete Card
                    </button>
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};