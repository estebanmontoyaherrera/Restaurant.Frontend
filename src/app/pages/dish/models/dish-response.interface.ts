export interface DishResponse {
  dishId: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  isAvailable: boolean;
  availabilityDescription: any;
  state: string;
  stateDescription: any;
  auditCreateDate: string;
  icEdit: string;
  icToggle: string;
  icDelete: string;
}

export interface DishByIdResponse {
  dishId: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  isAvailable: boolean;
  state: string;
}
