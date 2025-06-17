import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { List as ListType, Card as CardType } from '../types';
import { List } from './List';
import { CardModal } from './CardPopup';
import { Container, Draggable } from 'react-smooth-dnd';

interface BoardProps {
    lists: ListType[];
    onAddList: (title: string) => void;
    onDeleteList: (listId: string) => void;
    onRenameList: (listId: string, newTitle: string) => void;
    onAddCard: (listId: string, title: string) => void;
    onUpdateCard: (listId: string, updatedCard: CardType) => void;
    onDeleteCard: (listId: string, cardId: string) => void;
    onMoveCard: (cardId: string, fromListId: string, toListId: string, toIndex: number) => void;
    onMoveList: (fromIndex: number, toIndex: number) => void;
}

export const Board: React.FC<BoardProps> = ({
    lists,
    onAddList,
    onDeleteList,
    onRenameList,
    onAddCard,
    onUpdateCard,
    onDeleteCard,
    onMoveCard,
    onMoveList,
}) => {
    const [isAddingList, setIsAddingList] = useState(false);
    const [newListTitle, setNewListTitle] = useState('');
    const [selectedCard, setSelectedCard] = useState<{ card: CardType; listId: string } | null>(null);

    const handleAddList = () => {
        if (newListTitle.trim()) {
            onAddList(newListTitle.trim());
            setNewListTitle('');
            setIsAddingList(false);
        }
    };

    const handleEditCard = (card: CardType) => {
        const listId = lists.find(list => list.cards.some(c => c.id === card.id))?.id;
        if (listId) {
            setSelectedCard({ card, listId });
        }
    };

    const handleSaveCard = (updatedCard: CardType) => {
        if (selectedCard) {
            onUpdateCard(selectedCard.listId, updatedCard);
            setSelectedCard(null);
        }
    };

    const handleDeleteCard = () => {
        if (selectedCard) {
            onDeleteCard(selectedCard.listId, selectedCard.card.id);
            setSelectedCard(null);
        }
    };

    const handleListDrop = (dropResult: any) => {
        const { removedIndex, addedIndex } = dropResult;
        if (removedIndex !== null && addedIndex !== null) {
            onMoveList(removedIndex, addedIndex);
        }
    };

    return (
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
            <div className="flex space-x-6 p-6 h-full min-w-max">
                <Container
                    orientation="horizontal"
                    onDrop={handleListDrop}
                    dragHandleSelector=".list-drag-handle"
                    dropPlaceholder={{
                        animationDuration: 150,
                        showOnTop: true,
                        className: 'drop-preview'
                    }}
                >
                    {lists.map((list) => (
                        <Draggable key={list.id}>
                            <List
                                list={list}
                                onAddCard={onAddCard}
                                onEditCard={handleEditCard}
                                onDeleteList={onDeleteList}
                                onRenameList={onRenameList}
                                onMoveCard={onMoveCard}
                            />
                        </Draggable>
                    ))}
                </Container>

                <div className="flex-shrink-0">
                    {isAddingList ? (
                        <div className="bg-gray-50 rounded-xl p-4 w-80 shadow-sm border border-gray-200">
                            <input
                                type="text"
                                value={newListTitle}
                                onChange={(e) => setNewListTitle(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddList()}
                                placeholder="Enter list title..."
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                                autoFocus
                            />
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleAddList}
                                    className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Add List
                                </button>
                                <button
                                    onClick={() => {
                                        setIsAddingList(false);
                                        setNewListTitle('');
                                    }}
                                    className="px-3 py-2 text-gray-600 text-sm hover:text-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAddingList(true)}
                            className="bg-gray-100 hover:bg-gray-200 rounded-xl p-4 w-80 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 border-2 border-dashed border-gray-300 hover:border-gray-400"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add another list
                        </button>
                    )}
                </div>
            </div>

            {selectedCard && (
                <CardModal
                    card={selectedCard.card}
                    isOpen={true}
                    onClose={() => setSelectedCard(null)}
                    onSave={handleSaveCard}
                    onDelete={handleDeleteCard}
                />
            )}
        </div>
    );
};