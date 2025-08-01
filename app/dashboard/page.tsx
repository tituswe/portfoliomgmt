import { AppSidebar } from "@/components/app-sidebar";
import { ChartPortfolioPerformance } from "@/components/charts/chart-portfolio-performance";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChartPortfolio } from "@/components/charts/chart-portfolio";
import { ChartHoldings } from "@/components/charts/chart-holdings";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { apiUrl } from "@/lib/env";
import { Position, Transaction } from "@/lib/types";

async function getPortfolioPerformanceChartData() {
  const chartData = await fetch(`${apiUrl}/charts/portfolio-linechart`, {
    cache: "no-store",
  }).then((res) => res.json());
  return chartData;
}

async function getPortfolioChartData() {
  const chartData = await fetch(`${apiUrl}/charts/portfolio-piechart`, {
    cache: "no-store",
  }).then((res) => res.json());
  return chartData;
}

async function getHoldingsChartData() {
  const chartData = await fetch(`${apiUrl}/charts/portfolio-barchart`, {
    cache: "no-store",
  }).then((res) => res.json());
  return chartData;
}

async function getPortfolioData() {
  const posts: Position[] = await fetch(`${apiUrl}/portfolio`, {
    cache: "no-store",
  }).then((res) => res.json());
  return posts;
}

async function getTransactionsData() {
  const transactions: Transaction[] = await fetch(`${apiUrl}/transactions`, {
    cache: "no-store",
  }).then((res) => res.json());
  return transactions;
}

export default async function Page() {
  const portfolioPerformanceChartData = getPortfolioPerformanceChartData();
  const portfolioChartData = getPortfolioChartData();
  const holdingsChartData = getHoldingsChartData();
  const portfolioData = getPortfolioData();
  const transactionData = getTransactionsData();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="sidebar" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <Suspense
                  fallback={<Skeleton className="h-[390px] rounded-xl" />}
                >
                  <ChartPortfolioPerformance
                    chartData={portfolioPerformanceChartData}
                  />
                </Suspense>
              </div>
              <div className="px-4 lg:px-6 grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <Suspense
                  fallback={<Skeleton className="h-[428px] rounded-xl" />}
                >
                  <ChartPortfolio chartData={portfolioChartData} />
                </Suspense>
                <Suspense
                  fallback={<Skeleton className="h-[428px] rounded-xl" />}
                >
                  <ChartHoldings chartData={holdingsChartData} />
                </Suspense>
              </div>
              <Suspense fallback={<Skeleton className="h-120 mx-6" />}>
                <DataTable
                  portfolioData={portfolioData}
                  transactionData={transactionData}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
