"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { fetchLivePrices } from "@/lib/api";
import { PriceData } from "@/lib/types";
import { X, Plus } from "lucide-react";
import React, { useState, useEffect } from "react";

export const description = "Watchlist";

type WatchlistItem = {
  ticker: string;
  name?: string;
  price?: number;
  changePercent?: number;
};

const ITEMS_PER_PAGE = 5;

export function Watchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [newTicker, setNewTicker] = useState("");
  const [inputError, setInputError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const paginatedItems = items.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    const saved = localStorage.getItem("watchlist");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse watchlist", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    const tickers = items.map((item) => item.ticker);
    if (tickers.length > 0) {
      fetchLivePrices(tickers).then(setPrices);

      const interval = setInterval(() => {
        fetchLivePrices(tickers).then(setPrices);
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [items]);

  const addItem = () => {
    const ticker = newTicker.trim().toUpperCase();
    if (!ticker) {
      setInputError("Please enter a ticker symbol");
      return;
    }

    if (items.some((item) => item.ticker === ticker)) {
      setInputError(`${ticker} is already in your watchlist`);
      return;
    }

    setItems([...items, { ticker }]);
    setNewTicker("");
    setInputError("");
    setCurrentPage(1);
  };

  const removeItem = (ticker: string) => {
    setItems((prev) => prev.filter((item) => item.ticker !== ticker));
    setPrices((prev) => {
      const newPrices = { ...prev };
      delete newPrices[ticker];
      return newPrices;
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Watchlist</CardTitle>
        <CardDescription>
          {items.length > 0
            ? `Tracking ${items.length} assets`
            : "Your tracked assets will appear here"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newTicker}
            onChange={(e) => {
              setNewTicker(e.target.value);
              setInputError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="Add ticker (e.g. AAPL)"
            className="flex-1"
          />
          <Button variant="outline" onClick={addItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
        {inputError && (
          <div className="text-sm text-destructive">{inputError}</div>
        )}

        {/* Table */}
        {items.length > 0 ? (
          <>
            <div className="rounded-md border">
              <Table className="[&_tr]:h-10 [&_td]:py-1 [&_th]:py-1">
                <TableHeader className="bg-muted sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="w-[120px]">Ticker</TableHead>
                    <TableHead className="w-[120px]">Price</TableHead>
                    <TableHead className="w-[120px]">% Change</TableHead>
                    <TableHead className="text-right w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.map((item) => (
                    <TableRow key={item.ticker}>
                      <TableCell className="font-medium">
                        {item.ticker}
                      </TableCell>
                      <TableCell>
                        {prices[item.ticker]?.currentPrice
                          ? `$${prices[item.ticker].currentPrice.toFixed(2)}`
                          : "--"}
                      </TableCell>
                      <TableCell
                        className={`${
                          prices[item.ticker]?.percentageChange > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {prices[item.ticker]?.percentageChange !== undefined
                          ? `${
                              prices[item.ticker].percentageChange >= 0
                                ? "+"
                                : ""
                            }${prices[item.ticker].percentageChange.toFixed(
                              2
                            )}%`
                          : "--"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.ticker)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground border rounded">
            <p className="font-medium">No assets tracked</p>
            <p className="text-sm">Add stocks above to get started</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-center gap-0 text-sm mt-auto">
        <div>
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
