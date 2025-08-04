import { apiUrl } from "./env";
import { PortfolioSummary, Position, Transaction } from "./types";

export async function getPortfolioSummary() {
  const summary: PortfolioSummary = await fetch(`${apiUrl}/summary`, {
    cache: "no-store",
  }).then((res) => res.json());
  return summary;
}

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
  const transactions: Transaction[] = await fetch(`${apiUrl}/transactions-table`, {
    cache: "no-store",
  }).then((res) => res.json());
  return transactions;
}

export async function createTransaction(
  transaction: Omit<Transaction, "id" | "transaction_date">
): Promise<Transaction> {
  const res = await fetch(`${apiUrl}/transaction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction),
  });

  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const err = await res.json();
        if (typeof err?.detail === "string") msg = err.detail;
        else if (Array.isArray(err?.detail))
          msg = err.detail.map((e: any) => e.msg || JSON.stringify(e)).join("; ");
        else if (err?.message) msg = err.message;
      } else {
        const text = await res.text();
        if (text) msg = text;
      }
    } catch { }
    throw new Error(msg);
  }

  return res.json();
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