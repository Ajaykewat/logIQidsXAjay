import React from 'react';
import { Trello, RotateCcw } from 'lucide-react';
import { CollaborationLinks } from './common';

interface HeaderProps {
    onResetBoard: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onResetBoard }) => {

    const LogoIcon = () => (
        <div className="bg-blue-600 p-2 rounded-lg">
            <Trello className="w-6 h-6 text-white" />
        </div>
    );




    return (
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <LogoIcon />
                    <h1 className="text-2xl font-bold text-gray-900">
                        TaskBoard X <CollaborationLinks />
                    </h1>
                </div>

                <button
                    onClick={onResetBoard}
                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Board
                </button>
            </div>
        </header>
    );
};