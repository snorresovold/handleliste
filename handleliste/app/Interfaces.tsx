export interface ShoppingList {
  id: string;
  title: string;
  created_at: Date;
  items?: Item[];
  creator: string;
  sharedWith?: string[];
}

export interface Item {
  id: string;
  name: string;
  checked: boolean;
  creator: string;
  created_at: Date;
}
