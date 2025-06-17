export interface Card {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  createdAt: string;
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
  createdAt: string;
}

export interface Board {
  lists: List[];
}

export interface DragItem {
  type: 'card' | 'list';
  id: string;
  listId?: string;
  index: number;
}