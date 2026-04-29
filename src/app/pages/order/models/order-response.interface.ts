export interface OrderResponse {
  orderId: number;
  tableNumber: number;
  waiterName: string;
  status: string;
  statusDescription: any;
  total: number;
  state: string;
  stateDescription: any;
  auditCreateDate: string;
  icItems: string;
  icAdvance: string;
  icEdit: string;
  icDelete: string;
}

export interface OrderByIdResponse {
  orderId: number;
  tableNumber: number;
  waiterName: string;
  status: string;
  total: number;
  state: string;
}

export interface OrderDetailResponse {
  orderDetailId: number;
  orderId: number;
  dishId: number;
  dishName?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  notes?: string;
  state: string;
  stateDescription: any;
  auditCreateDate: string;
  icEdit: string;
  icDelete: string;
}
