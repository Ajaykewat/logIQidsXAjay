import React, { useMemo, useState } from 'react';
import { Plus, MoreHorizontal, Trash2, Edit2, GripVertical } from 'lucide-react';
import type { List as ListType, Card as CardType } from '../types';
import { Card } from './Card';
import { Container, Draggable } from 'react-smooth-dnd';

interface ListProps {
    list: ListType;
    onAddCard: (listId: string, title: string) => void;
    onEditCard: (card: CardType) => void;
    onDeleteList: (listId: string) => void;
    onRenameList: (listId: string, newTitle: string) => void;
    onMoveCard: (cardId: string, fromListId: string, toListId: string, toIndex: number) => void;
}

export const List: React.FC<ListProps> = ({
    list,
    onAddCard,
    onEditCard,
    onDeleteList,
    onRenameList,
    onMoveCard,
}) => {
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCardTitle, setNewCardTitle] = useState('');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(list.title);
    const [showMenu, setShowMenu] = useState(false);

    const handleAddCard = () => {
        if (newCardTitle.trim()) {
            onAddCard(list.id, newCardTitle.trim());
            setNewCardTitle('');
            setIsAddingCard(false);
        }
    };

    const handleRenameList = () => {
        if (editedTitle.trim() && editedTitle !== list.title) {
            onRenameList(list.id, editedTitle.trim());
        }
        setIsEditingTitle(false);
    };

    const handleCardDrop = (dropResult: any) => {
        const { removedIndex, addedIndex, payload } = dropResult;

        if (addedIndex !== null) {
            const cardId = payload.id;
            const fromListId = payload.listId;
            onMoveCard(cardId, fromListId, list.id, addedIndex);
        }
    };

    const getCardPayload = (index: number) => {
        return {
            id: list.cards[index].id,
            listId: list.id,
            card: list.cards[index]
        };
    };

    const colorPalette = [
        '#FF6B6B', '#6BCB77', '#4D96FF', '#FFD93D', '#845EC2',
        '#00C9A7', '#FF9671', '#D65DB1', '#FFC75F', '#F9F871',
        '#0081CF', '#B0A8B9', '#B8F2E6', '#F6C90E', '#EA7773',
        '#66DE93', '#A66DD4', '#3F72AF', '#F67280', '#C06C84',
    ];

    function getRandomPaletteColor(): string {
        const index = Math.floor(Math.random() * colorPalette.length);
        return colorPalette[index];
    }

    function getColorById(id: string): string {
        const hash = Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colorPalette[hash % colorPalette.length];
    }

    const listColor = useMemo(() => getColorById(list.id), [list.id]);

    function getRandomColor(): string {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    const randomColor = useMemo(() => getRandomColor(), []);


    return (
        <div className="bg-gray-50 rounded-xl p-4 w-80 flex-shrink-0 shadow-sm border border-gray-200 m-2"
            style={{ backgroundColor: listColor }}

        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center flex-1">
                    <div className="list-drag-handle cursor-move mr-2 p-1 hover:bg-gray-200 rounded">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                    </div>
                    {isEditingTitle ? (
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            onBlur={handleRenameList}
                            onKeyPress={(e) => e.key === 'Enter' && handleRenameList()}
                            className="font-semibold text-gray-900 bg-transparent border-none outline-none text-base flex-1"
                            autoFocus
                        />
                    ) : (
                        <h2
                            className="font-semibold text-gray-900 text-base cursor-pointer hover:text-blue-600 transition-colors flex-1"
                            onClick={() => setIsEditingTitle(true)}
                        >
                            {list.title}
                        </h2>
                    )}
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                    >
                        <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-40 z-10">
                            <button
                                onClick={() => {
                                    setIsEditingTitle(true);
                                    setShowMenu(false);
                                }}
                                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Rename List
                            </button>
                            <button
                                onClick={() => {
                                    onDeleteList(list.id);
                                    setShowMenu(false);
                                }}
                                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete List
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-4 min-h-[100px]">
                <Container
                    groupName="cards"
                    onDrop={handleCardDrop}
                    getChildPayload={getCardPayload}
                    dropPlaceholder={{
                        animationDuration: 150,
                        showOnTop: true,
                        className: 'card-drop-preview'
                    }}
                >
                    {list.cards.map((card) => (
                        <Draggable key={card.id}>
                            <Card
                                card={card}
                                onEdit={onEditCard}
                                listId={list.id}
                            />
                        </Draggable>
                    ))}
                </Container>
            </div>

            {isAddingCard ? (
                <div className="space-y-2">
                    <input
                        type="text"
                        value={newCardTitle}
                        onChange={(e) => setNewCardTitle(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCard()}
                        placeholder="Enter card title..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                    />
                    <div className="flex space-x-2">
                        <button
                            onClick={handleAddCard}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add Card
                        </button>
                        <button
                            onClick={() => {
                                setIsAddingCard(false);
                                setNewCardTitle('');
                            }}
                            className="px-3 py-1 text-gray-600 text-sm hover:text-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsAddingCard(true)}
                    className="flex items-center w-full px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add a card
                </button>
            )}
        </div>
    );
};