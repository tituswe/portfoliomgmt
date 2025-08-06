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
import { Watchlist } from "@/components/watchlist";
import {
  getHoldingsChartData,
  getPortfolioChartData,
  getPortfolioData,
  getPortfolioPerformanceChartData,
  getPortfolioSummary,
  getTransactionsData,
} from "@/lib/api";

export default async function Page() {
  const portfolioSummary = getPortfolioSummary();
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
      {/* <AppSidebar variant="sidebar" /> */}
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Suspense
                fallback={
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 flex items-center justify-between gap-6 mx-6">
                    <Skeleton className="h-[182px] flex-grow rounded-xl" />
                    <Skeleton className="h-[182px] flex-grow rounded-xl" />
                    <Skeleton className="h-[182px] flex-grow rounded-xl" />
                    <Skeleton className="h-[182px] flex-grow rounded-xl" />
                  </div>
                }
              >
                <SectionCards data={portfolioSummary} />
              </Suspense>
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
                  fallback={<Skeleton className="h-[480px] rounded-xl" />}
                >
                  <ChartPortfolio chartData={portfolioChartData} />
                </Suspense>
                <Suspense
                  fallback={<Skeleton className="h-[480x] rounded-xl" />}
                >
                  <ChartHoldings chartData={holdingsChartData} />
                </Suspense>
                <Suspense
                  fallback={<Skeleton className="h-[480px] rounded-xl" />}
                >
                  <Watchlist />
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
