export interface ICity {
  id: string;
  name: string;
  country: string;
  imageUrl: string;
}

export interface IFeaturedProperty {
  id: string;
  slug: string;
  name: string;
  description: string;
  city: string;
  property: string;
  category: string;
  imageUrl: string | null;
  price: number;
  rating: number;
}
