import { apiUrl } from "./env";
import { PortfolioSummary, Position, Transaction, PriceData } from "./types";

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
  const transactions: Transaction[] = await fetch(
    `${apiUrl}/transactions-table`,
    {
      cache: "no-store",
    }
  ).then((res) => res.json());
  return transactions;
}

export async function createTransaction(
  transaction: Omit<Transaction, "id" | "name" | "transaction_date">,
  isBuy: boolean
): Promise<Transaction> {
  const transactionToCreate = {
    ...transaction,
    quantity: isBuy
      ? Math.abs(transaction.quantity)
      : -Math.abs(transaction.quantity),
  };
  const res = await fetch(`${apiUrl}/transaction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transactionToCreate),
  });

  if (!res.ok) {
    let msg;
    try {
      const err = await res.json();
      msg = err.detail;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}

export async function updateTransaction(
  transaction: Transaction,
  isBuy: boolean
): Promise<Transaction> {
  const transactionToUpdate = {
    ...transaction,
    quantity: isBuy
      ? Math.abs(transaction.quantity)
      : -Math.abs(transaction.quantity),
  };
  const res = await fetch(`${apiUrl}/transaction/${transaction.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transactionToUpdate),
  });

  if (!res.ok) {
    let msg;
    try {
      const err = await res.json();
      msg = err.detail;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}

export async function deleteTransaction(transactionId: string): Promise<void> {
  const res = await fetch(`${apiUrl}/transaction/${transactionId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    let msg;
    try {
      const err = await res.json();
      msg = err.detail;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}

export async function fetchLivePrices(
  tickers: string[]
): Promise<Record<string, PriceData>> {
  if (tickers.length === 0) return {};

  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 2);

    const todayStr = today.toISOString().split("T")[0];
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const [currentResponse, previousResponse] = await Promise.all([
      fetch(`${apiUrl}/prices/live`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tickers: tickers,
          interval: "5m",
          target_date: todayStr,
        }),
      }),
      fetch(`${apiUrl}/prices/live`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tickers: tickers,
          interval: "1d",
          target_date: yesterdayStr,
        }),
      }),
    ]);

    if (!currentResponse.ok || !previousResponse.ok) {
      throw new Error("Failed to fetch prices");
    }

    const currentData = await currentResponse.json();
    const previousData = await previousResponse.json();

    const currentPrices = currentData.reduce(
      (acc: Record<string, number>, item: any) => {
        if (item.close) acc[item.ticker] = item.close;
        return acc;
      },
      {}
    );

    const previousPrices = previousData.reduce(
      (acc: Record<string, number>, item: any) => {
        if (item.close) acc[item.ticker] = item.close;
        return acc;
      },
      {}
    );

    return tickers.reduce((acc: Record<string, PriceData>, ticker) => {
      const current = currentPrices[ticker];
      const previous = previousPrices[ticker];

      if (current && previous) {
        acc[ticker] = {
          currentPrice: current,
          previousClose: previous,
          percentageChange: ((current - previous) / previous) * 100,
        };
      } else if (current) {
        acc[ticker] = {
          currentPrice: current,
          previousClose: current,
          percentageChange: 0,
        };
      }

      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching prices:", error);
    return {};
  }
}
