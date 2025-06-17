import React from 'react';
import { Calendar, Clock } from 'lucide-react';
// import { Card as CardType } from '../types';
import type { Card as CardType } from '../types';

interface CardProps {
    card: CardType;
    onEdit: (card: CardType) => void;
    isDragging?: boolean;
    listId: string;
}

export const Card: React.FC<CardProps> = ({ card, onEdit, isDragging, listId }) => {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const isOverdue = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    return (
        <div
            onClick={() => onEdit(card)}
            className={`bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200 group mb-3 ${isDragging ? 'opacity-50 transform rotate-2' : ''
                }`}
        >
            <h3 className="font-medium text-gray-900 text-sm leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                {card.title}
            </h3>

            {card.description && (
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {card.description}
                </p>
            )}

            <div className="flex items-center justify-between">
                {card.dueDate && (
                    <div className={`flex items-center text-xs px-2 py-1 rounded ${isOverdue(card.dueDate)
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-600'
                        }`}>
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(card.dueDate)}
                    </div>
                )}

                <div className="flex items-center text-xs text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(card.createdAt).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};