export type Transaction = {
  id: string;
  ticker: string;
  name: string;
  quantity: number;
  price: number;
  transaction_date: string;
};

export type Postition = {
  id: string;
  ticker: string;
  name: string;
  quantity: number;
  avg_price: number;
  live_price: number;
  price_delta: number;
  pct_delta: number;
  pnl: number;
}