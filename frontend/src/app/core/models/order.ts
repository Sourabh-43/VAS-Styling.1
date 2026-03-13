import { OrderItem } from './order-item';

export interface Order {
  id: string;
  items: any[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  createdAt: number;
}
