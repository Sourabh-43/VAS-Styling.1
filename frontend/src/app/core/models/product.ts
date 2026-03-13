export interface Product {
  _id?: string;

  name: string;
  slug: string;
  price: number;
  stock: number;

  image: string;
   hoverImage?: string;

  gender: 'men' | 'women';     
  category: string;           

  sizes: string[];
  description?: string;
}