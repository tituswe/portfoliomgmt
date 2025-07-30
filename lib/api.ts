import { apiUrl } from "./env";
import { Postition, Transaction } from "./types";

export function getPortfolio(): Promise<Postition[]> {
  return fetch(`${apiUrl}/portfolio`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch portfolio data");
      }
      return response.json();
    });
}

export function getTransactions(): Promise<Transaction[]> {
  return fetch(`${apiUrl}/transactions`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      return response.json();
    })
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