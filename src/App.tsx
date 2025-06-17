import React, { useState, useEffect } from 'react';
import type { Board, List, Card } from './types';
import { Header } from './components/Header';
import { Board as BoardComponent } from './components/Board';
import { useLocalStorage } from './hooks/useLocalStorage';
import { CollaborationLinks } from './components/common';

const initialBoard: Board = {
  lists: [
    {
      id: '1',
      title: 'To Do',
      cards: [
        {
          id: '1',
          title: 'Welcome to LogIQids X Ajay!',
          description: 'This is a sample card. Click on it to edit details.',
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'In Progress',
      cards: [
        {
          id: '2',
          title: 'Next Task is to call Me 😁',
          description: 'Try dragging cards between lists or within lists.',
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Done',
      cards: [
        {
          id: '3',
          title: 'Thanks for showing interest',
          description: 'Basic board structure is complete!',
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    },
  ],
};

function App() {
  const [board, setBoard] = useLocalStorage<Board>('taskboard-data', initialBoard);

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const handleAddList = (title: string) => {
    const newList: List = {
      id: generateId(),
      title,
      cards: [],
      createdAt: new Date().toISOString(),
    };
    setBoard(prev => ({
      ...prev,
      lists: [...prev.lists, newList],
    }));
  };

  const handleDeleteList = (listId: string) => {
    setBoard(prev => ({
      ...prev,
      lists: prev.lists.filter(list => list.id !== listId),
    }));
  };

  const handleRenameList = (listId: string, newTitle: string) => {
    setBoard(prev => ({
      ...prev,
      lists: prev.lists.map(list =>
        list.id === listId ? { ...list, title: newTitle } : list
      ),
    }));
  };

  const handleAddCard = (listId: string, title: string) => {
    const newCard: Card = {
      id: generateId(),
      title,
      createdAt: new Date().toISOString(),
    };
    setBoard(prev => ({
      ...prev,
      lists: prev.lists.map(list =>
        list.id === listId
          ? { ...list, cards: [...list.cards, newCard] }
          : list
      ),
    }));
  };

  const handleUpdateCard = (listId: string, updatedCard: Card) => {
    setBoard(prev => ({
      ...prev,
      lists: prev.lists.map(list =>
        list.id === listId
          ? {
            ...list,
            cards: list.cards.map(card =>
              card.id === updatedCard.id ? updatedCard : card
            ),
          }
          : list
      ),
    }));
  };

  const handleDeleteCard = (listId: string, cardId: string) => {
    setBoard(prev => ({
      ...prev,
      lists: prev.lists.map(list =>
        list.id === listId
          ? { ...list, cards: list.cards.filter(card => card.id !== cardId) }
          : list
      ),
    }));
  };

  const handleMoveCard = (cardId: string, fromListId: string, toListId: string, toIndex: number) => {
    setBoard(prev => {
      const newLists = [...prev.lists];
      const fromList = newLists.find(list => list.id === fromListId);
      const toList = newLists.find(list => list.id === toListId);

      if (!fromList || !toList) return prev;

      const cardIndex = fromList.cards.findIndex(card => card.id === cardId);
      if (cardIndex === -1) return prev;

      const [movedCard] = fromList.cards.splice(cardIndex, 1);
      let adjustedIndex = toIndex;
      if (fromListId === toListId && toIndex > cardIndex) {
        adjustedIndex = toIndex - 1;
      }

      toList.cards.splice(adjustedIndex, 0, movedCard);

      return { ...prev, lists: newLists };
    });
  };

  const handleMoveList = (fromIndex: number, toIndex: number) => {
    setBoard(prev => {
      const newLists = [...prev.lists];
      const [movedList] = newLists.splice(fromIndex, 1);
      newLists.splice(toIndex, 0, movedList);
      return { ...prev, lists: newLists };
    });
  };

  const handleResetBoard = () => {
    setBoard(initialBoard);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header onResetBoard={handleResetBoard} />

      <BoardComponent
        lists={board.lists}
        onAddList={handleAddList}
        onDeleteList={handleDeleteList}
        onRenameList={handleRenameList}
        onAddCard={handleAddCard}
        onUpdateCard={handleUpdateCard}
        onDeleteCard={handleDeleteCard}
        onMoveCard={handleMoveCard}
        onMoveList={handleMoveList}
      />

      <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center">
        <p className="text-xl text-black">
          <CollaborationLinks />
        </p>
      </footer>
    </div>
  );
}

export default App;