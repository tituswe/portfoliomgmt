export type Transaction = {
  id: string; // UUID
  ticker: string;
  stockName: string;
  quantity: number;
  transactionTime: string; // ISO 8601 timestamp
  transactionPrice: number;
};
