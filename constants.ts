
import { Store, MenuItem, OrderStatus } from './types';

export const COLORS = {
  primary: '#FF5F00', // FASTgo Orange
  secondary: '#FFFFFF',
  textMain: '#1A1A1A',
  textMuted: '#666666',
};

export const MOCK_STORES: Store[] = [
  { id: 's1', name: 'Burger King', rating: 4.5, image: 'https://picsum.photos/seed/bk/400/300', cuisine: 'Fast Food' },
  { id: 's2', name: 'Pizza Hut', rating: 4.2, image: 'https://picsum.photos/seed/ph/400/300', cuisine: 'Italian' },
  { id: 's3', name: 'KFC', rating: 4.0, image: 'https://picsum.photos/seed/kfc/400/300', cuisine: 'Chicken' },
  { id: 's4', name: 'Sushi Zen', rating: 4.8, image: 'https://picsum.photos/seed/sushi/400/300', cuisine: 'Japanese' },
];

export const MOCK_MENU: MenuItem[] = [
  { id: 'm1', name: 'Whopper Meal', price: 12.99, description: 'Flame-grilled beef burger with fries and drink.', image: 'https://picsum.photos/seed/w1/200/200' },
  { id: 'm2', name: 'Pepperoni Feast', price: 15.50, description: 'Double pepperoni with extra mozzarella cheese.', image: 'https://picsum.photos/seed/p1/200/200' },
  { id: 'm3', name: 'Zinger Box', price: 10.99, description: 'Spicy chicken burger, wings, and sides.', image: 'https://picsum.photos/seed/z1/200/200' },
];
