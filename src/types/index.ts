export interface CoreKPIs {
  total_sales: number;
  total_profit: number;
  total_orders: number;
  total_quantity: number;
  average_order_value: number;
  profit_margin_pct: number;
  average_discount_pct: number;
  average_shipping_days: number;
  profitable_orders_pct: number;
}

export interface CategoryMetric {
  category: string;
  sales: number;
  profit: number;
  quantity: number;
  orders: number;
  avg_discount: number;
  profit_margin_pct: number;
  sales_share_pct: number;
  avg_discount_pct: number;
}

export interface RegionalMetric {
  region: string;
  sales: number;
  profit: number;
  quantity: number;
  orders: number;
  avg_discount: number;
  profit_margin_pct: number;
  avg_discount_pct: number;
}

export interface SegmentMetric {
  segment: string;
  sales: number;
  profit: number;
  customers: number;
  orders: number;
  profit_margin_pct: number;
}

export interface SubCategoryMetric {
  category: string;
  sub_category: string;
  sales: number;
  profit: number;
  quantity: number;
  orders: number;
  avg_discount: number;
  profit_margin_pct: number;
  avg_discount_pct: number;
}

export interface UnprofitableProduct {
  product_id: string;
  product_name: string;
  category: string;
  sub_category: string;
  total_sales: number;
  total_profit: number;
  units_sold: number;
  avg_discount: number;
  profit_margin_pct: number;
  avg_discount_pct: number;
}

export interface MonthlyTrend {
  order_year_month: string;
  sales: number;
  profit: number;
  order_id: number;
  quantity: number;
}

export interface DiscountBracket {
  discount_bracket: string;
  transactions: number;
  sales: number;
  profit: number;
  profitable_tx: number;
  margin_pct: number;
  profitable_rate_pct: number;
}

export interface StatePerformance {
  state: string;
  region: string;
  sales: number;
  profit: number;
  order_id: number;
  discount: number;
  margin_pct: number;
  avg_discount_pct: number;
}

export interface TopProduct {
  product_id: string;
  product_name: string;
  category: string;
  sub_category: string;
  sales: number;
  profit: number;
}

export interface TopCustomer {
  customer_id: string;
  customer_name: string;
  segment: string;
  sales: number;
  profit: number;
  order_id: number;
}

export interface TransactionRow {
  row_id: number;
  order_id: string;
  order_date: string;
  ship_date: string;
  ship_mode: string;
  customer_id: string;
  customer_name: string;
  segment: string;
  country: string;
  city: string;
  state: string;
  postal_code: string;
  region: string;
  product_id: string;
  category: string;
  sub_category: string;
  product_name: string;
  sales: number;
  quantity: number;
  discount: number;
  profit: number;
  shipping_days?: number;
  profit_margin?: number;
  is_profitable?: boolean;
}

export interface SuperstoreDataPayload {
  kpis: CoreKPIs;
  categoryBreakdown: CategoryMetric[];
  regionalBreakdown: RegionalMetric[];
  segmentBreakdown: SegmentMetric[];
  subCategoryBreakdown: SubCategoryMetric[];
  unprofitableProducts: UnprofitableProduct[];
  monthlyTrends: MonthlyTrend[];
  discountAnalysis: DiscountBracket[];
  statePerformance: StatePerformance[];
  topProductsSales: TopProduct[];
  topCustomers: TopCustomer[];
  sampleRows: TransactionRow[];
}
