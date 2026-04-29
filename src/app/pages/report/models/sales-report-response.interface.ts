export interface SalesByCategory {
  category: string;
  quantitySold: number;
  totalSales: number;
  percentageOfTotal: number;
}

export interface SalesByDish {
  name: string;
  category: string;
  quantitySold: number;
  totalSales: number;
}

export interface SalesReportResponse {
  totalSales: number;
  totalOrders: number;
  averageTicket: number;
  bestSellingDish?: string;
  salesByCategory: SalesByCategory[];
  salesByDish: SalesByDish[];
}
