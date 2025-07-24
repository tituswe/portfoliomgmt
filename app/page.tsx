import { NavBar } from "@/components/nav-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionTable } from "./components/transaction-table";
import { PerformanceChart } from "./components/performance-chart";
import { PortfolioChart } from "./components/portfolio-chart";
import { HoldingsChart } from "./components/holdings-chart";

export default function Home() {
  return (
    <div>
      <NavBar />
      <div className="grid grid-cols-3 gap-6 px-12 h-[calc(100vh-10em)]">
        <div className="col-span-1">
          <TransactionTable />
        </div>
        <div className="col-span-2 flex flex-col space-y-6">
          <PerformanceChart />
          <div className="grid grid-cols-2 gap-6 h-full">
            <div className="col-span-1">
              <PortfolioChart />
            </div>
            <div className="col-span-1">
              <HoldingsChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
