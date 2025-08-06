import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PortfolioSummary } from "@/lib/types";
import { use } from "react";
import { Icon } from "lucide-react";

export function SectionCards({ data }: { data: Promise<PortfolioSummary> }) {
  const {
    total_value,
    total_value_pct,
    monthly_pnl,
    monthly_pnl_pct,
    all_time_returns,
    all_time_returns_pct,
    cash,
    cash_pct,
    invested_val,
    invested_val_pct,
  } = use(data);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Portfolio Value</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {total_value.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {total_value_pct > 0 ? (
                <>
                  <IconTrendingUp />
                  {total_value_pct.toFixed(1)}%
                </>
              ) : (
                <>
                  <IconTrendingDown />
                  {total_value_pct.toFixed(1)}%
                </>
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Portfolio {total_value_pct > 0 ? "grew" : "shrank"} this month{" "}
            {total_value_pct > 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            Total value across all current holdings
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Invested Value</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {invested_val.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {invested_val_pct > 0 ? (
                <>
                  <IconTrendingUp />
                  {invested_val_pct.toFixed(1)}%
                </>
              ) : (
                <>
                  <IconTrendingDown />
                  {invested_val_pct.toFixed(1)}%
                </>
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Investment portfolio {invested_val_pct > 0 ? "increased" : "decreased"}{" "} this month
            {invested_val_pct > 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            Total value invested this month
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Monthly P&L</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {monthly_pnl.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {monthly_pnl_pct > 0 ? (
                <>
                  <IconTrendingUp />
                  {monthly_pnl_pct.toFixed(1)}%
                </>
              ) : (
                <>
                  <IconTrendingDown />
                  {monthly_pnl_pct.toFixed(1)}%
                </>
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {monthly_pnl_pct > 0 ? "Increase" : "Decline"} in value this month{" "}
            {monthly_pnl_pct > 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            Track short-term portfolio volatility
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>All Time Returns</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {all_time_returns.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {all_time_returns_pct > 0 ? (
                <>
                  <IconTrendingUp />
                  {all_time_returns_pct.toFixed(1)}%
                </>
              ) : (
                <>
                  <IconTrendingDown />
                  {all_time_returns_pct.toFixed(1)}%
                </>
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Cumulative portfolio {all_time_returns_pct > 0 ? "gain" : "loss"}{" "}
            {all_time_returns_pct > 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            Total profit since inception
          </div>
        </CardFooter>
      </Card>

    </div>
  );
}
