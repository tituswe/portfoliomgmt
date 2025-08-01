import { AppSidebar } from "@/components/app-sidebar";
import { ChartPortfolioPerformance } from "@/components/charts/chart-portfolio-performance";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { mockPositions, mockTransactions } from "./data";
import { ChartPortfolio } from "@/components/charts/chart-portfolio";
import { ChartHoldings } from "@/components/charts/chart-holdings";

export default function Page() {
  const portfolioData = mockPositions;
  const transactionData = mockTransactions;

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
                <ChartPortfolioPerformance />
              </div>
              <div className="px-4 lg:px-6 grid grid-cols-3 gap-6">
                <ChartPortfolio />
                <ChartHoldings />
              </div>
              <DataTable
                portfolioData={portfolioData}
                transactionData={transactionData}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
