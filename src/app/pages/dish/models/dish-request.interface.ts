export interface DishCreateRequest {
  name: string;
  description?: string;
  price: number;
  category: string;
}

export interface DishUpdateRequest {
  dishId: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  isAvailable: boolean;
  state: string;
}
