import { apiUrl } from "./env";
import { Position, Transaction } from "./types";

export async function getPortfolioPerformanceChartData() {
  const chartData = await fetch(`${apiUrl}/charts/portfolio-linechart`, {
    cache: "no-store",
  }).then((res) => res.json());
  return chartData;
}

export async function getPortfolioChartData() {
  const chartData = await fetch(`${apiUrl}/charts/portfolio-piechart`, {
    cache: "no-store",
  }).then((res) => res.json());
  return chartData;
}

export async function getHoldingsChartData() {
  const chartData = await fetch(`${apiUrl}/charts/portfolio-barchart`, {
    cache: "no-store",
  }).then((res) => res.json());
  return chartData;
}

export async function getPortfolioData() {
  const posts: Position[] = await fetch(`${apiUrl}/portfolio`, {
    cache: "no-store",
  }).then((res) => res.json());
  return posts;
}

export async function getTransactionsData() {
  const transactions: Transaction[] = await fetch(`${apiUrl}/transactions`, {
    cache: "no-store",
  }).then((res) => res.json());
  return transactions;
}

export function createTransaction(
  transaction: Omit<Transaction, "id" | "transaction_date">
): Promise<Transaction> {
  return fetch(`${apiUrl}/transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to create transaction");
    }
    return response.json();
  });
}

export function updateTransaction(
  transaction: Transaction
): Promise<Transaction> {
  return fetch(`${apiUrl}/transaction/${transaction.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to update transaction");
    }
    return response.json();
  });
}

export function deleteTransaction(transactionId: string): Promise<void> {
  return fetch(`${apiUrl}/transaction/${transactionId}`, {
    method: "DELETE",
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to delete transaction");
    }
  });
}