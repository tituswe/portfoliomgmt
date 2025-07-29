export type Transaction = {
  id: string; // UUID
  ticker: string;
  name: string;
  quantity: number;
  price: number;
  transaction_date: string; // ISO 8601 timestamp
};
