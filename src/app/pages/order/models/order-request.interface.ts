export interface OrderCreateRequest {
  tableNumber: number;
  waiterName: string;
}

export interface OrderUpdateRequest {
  orderId: number;
  tableNumber: number;
  waiterName: string;
  status: string;
  state: string;
}

export interface OrderDetailCreateRequest {
  orderId?: number;
  dishId: number;
  quantity: number;
  notes?: string;
}

export interface OrderDetailUpdateRequest {
  orderDetailId?: number;
  orderId?: number;
  dishId: number;
  quantity: number;
  unitPrice: number;
  notes?: string;
  state: string;
}
