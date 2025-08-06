export type PortfolioSummary = {
  total_value: number;
  total_value_pct: number;
  monthly_pnl: number;
  monthly_pnl_pct: number;
  all_time_returns: number;
  all_time_returns_pct: number;
  cash: number;
  cash_pct: number;
};

export type Transaction = {
  id: string;
  ticker: string;
  name: string;
  quantity: number;
  price: number;
  transaction_date: string;
};

export type Position = {
  id: string;
  ticker: string;
  name: string;
  quantity: number;
  avg_price: number;
  live_price: number;
  price_delta: number;
  pct_delta: number;
  pnl: number;
};

export type PriceData = {
  currentPrice: number;
  previousClose: number;
  percentageChange: number;
};
