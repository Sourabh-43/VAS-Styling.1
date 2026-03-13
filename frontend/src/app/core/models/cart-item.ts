export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}