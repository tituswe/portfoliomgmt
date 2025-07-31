import { NavBar } from "@/components/nav-bar";
import { TransactionTable } from "../components/transaction-table";

export default function Transactions() {
  return (
    <div>
      <NavBar />
      <div className="px-12 h-[calc(100vh-10em)]">
        <TransactionTable />
      </div>
    </div>
  );
}
