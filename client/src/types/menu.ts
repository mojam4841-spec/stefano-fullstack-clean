export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string | null;
  image_url?: string | null;
  active: boolean;
}
