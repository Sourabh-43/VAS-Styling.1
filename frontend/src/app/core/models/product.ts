export interface Product {
  _id?: string;

  name: string;
  slug: string;
  price: number;
  stock: number;

  images?: string[];   // ✅ new
  image?: string;      // ✅ old support
  hoverImage?: string;

  gender: 'men' | 'women';
  category: string;

  sizes: string[];
  description?: string;
}