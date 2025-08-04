"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconGripVertical,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Position, Transaction } from "@/lib/types";
import { CreateTransactionButton } from "@/components/create-transaction-button";
import { UpdateTransactionButton } from "@/components/update-transaction-form";
import { DeleteTransactionButton } from "./delete-transaction-button";
import { Badge } from "./ui/badge";
import { IconChevronUp, IconChevronDown } from "@tabler/icons-react";

function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({ id });
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent mr-[5px]"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

const portfolioColumns: ColumnDef<Position>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
    enableSorting: false,
    enableHiding: false,
    size: 25,
  },
  {
    accessorKey: "ticker",
    header: "Ticker",
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.ticker}</span>
    ),
    enableSorting: true,
    size: 100,
  },
  {
    accessorKey: "name",
    header: "Stock Name",
    enableSorting: true,
    size: 200,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => row.original.quantity.toLocaleString(),
    enableSorting: true,
    size: 100,
  },
  {
    accessorKey: "avg_price",
    header: "Avg. Price",
    cell: ({ row }) => `$${row.original.avg_price.toFixed(2)}`,
    enableSorting: true,
    size: 100,
  },
  {
    accessorKey: "live_price",
    header: "Live Price",
    cell: ({ row }) => `$${row.original.live_price.toFixed(2)}`,
    enableSorting: true,
    size: 100,
  },
  {
    accessorKey: "price_delta",
    header: "Δ Price",
    cell: ({ row }) => {
      const value = row.original.price_delta;
      return (
        <span className={value >= 0 ? "text-green-600" : "text-red-600"}>
          {value >= 0 ? "+" : ""}
          {value.toFixed(2)}
        </span>
      );
    },
    enableSorting: true,
    size: 100,
  },
  {
    accessorKey: "pct_delta",
    header: "% Change",
    cell: ({ row }) => {
      const value = row.original.pct_delta;
      return (
        <span className={value >= 0 ? "text-green-600" : "text-red-600"}>
          {value >= 0 ? "+" : ""}
          {value.toFixed(2)}%
        </span>
      );
    },
    enableSorting: true,
    size: 100,
  },
  {
    accessorKey: "pnl",
    header: "P&L",
    cell: ({ row }) => {
      const value = row.original.pnl;
      return (
        <span className={value >= 0 ? "text-green-600" : "text-red-600"}>
          {value >= 0 ? "+" : "-"}${Math.abs(value).toFixed(2)}
        </span>
      );
    },
    enableSorting: true,
    size: 100,
  },
];

const transactionColumns: ColumnDef<Transaction>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <div className="h-8" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "ticker",
    header: "Ticker",
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue() as string}</span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Stock Name",
    cell: ({ getValue }) => getValue() as string,
    enableSorting: false,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ getValue }) => {
      const val = Number(getValue());
      return val > 0 ? `+${val}` : `${val}`;
    },
    enableSorting: false,
  },
  {
    accessorKey: "price",
    header: "Unit Price",
    cell: ({ getValue }) =>
      `$${Number(getValue()).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    enableSorting: false,
  },
  {
    accessorKey: "transaction_date",
    header: "Date",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return date.toLocaleDateString("en-SG", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    enableSorting: false,
  },
  {
    accessorKey: "buy_sell",
    header: "Buy/Sell",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return (
        <Badge
          variant={"secondary"}
          className={value === "Buy" ? "text-green-600" : "text-red-600"}
        >
          {value}
        </Badge>
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    header: "",
    cell: (c) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-4"
            size="icon"
          >
            <IconDotsVertical className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <UpdateTransactionButton transaction={c.row.original} />
          <DropdownMenuSeparator />
          <DeleteTransactionButton transaction={c.row.original} />
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];

function DraggableRow({ row }: { row: Row<Position> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 h-12"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable({
  portfolioData: initialPortfolioPromise,
  transactionData: initialTransactionPromise,
}: {
  portfolioData: Promise<Position[]>;
  transactionData: Promise<Transaction[]>;
}) {
  const initialPortfolioData = React.use(initialPortfolioPromise);
  const initialTransactionData = React.use(initialTransactionPromise);
  const [portfolioData, setPortfolioData] = React.useState(
    () => initialPortfolioData || []
  );
  const [transactionData, setTransactionData] = React.useState(
    () => initialTransactionData || []
  );
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "ticker", desc: false },
  ]);
  const [portfolioPagination, setPortfolioPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [transactionPagination, setTransactionPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const portfolioDataIds = React.useMemo<UniqueIdentifier[]>(
    () => portfolioData?.map(({ id }) => id) || [],
    [portfolioData]
  );

  const portfolioTable = useReactTable({
    data: portfolioData,
    columns: portfolioColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: portfolioPagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPortfolioPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const transactionTable = useReactTable({
    data: transactionData,
    columns: transactionColumns,
    state: {
      pagination: transactionPagination,
      sorting,
    },
    onSortingChange: setSorting,
    onPaginationChange: setTransactionPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setPortfolioData((data) => {
        const oldIndex = portfolioDataIds.indexOf(active.id);
        const newIndex = portfolioDataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  return (
    <Tabs
      defaultValue="portfolio"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="portfolio">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="portfolio">Portfolio</SelectItem>
            <SelectItem value="transactions">Transactions</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuContent align="end" className="w-56">
              {portfolioTable
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <CreateTransactionButton />
        </div>
      </div>
      <TabsContent
        value="portfolio"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table style={{ tableLayout: "fixed" }}>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {portfolioTable.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="h-12">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          style={{
                            width: `${header.getSize()}px`,
                            minWidth: `${header.getSize()}px`,
                          }}
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              className={`flex items-center ${
                                header.column.getCanSort()
                                  ? "cursor-pointer select-none group"
                                  : ""
                              }`}
                              onClick={() => {
                                if (header.column.getCanSort()) {
                                  const currentSort =
                                    header.column.getIsSorted();
                                  header.column.toggleSorting(
                                    currentSort === "asc"
                                  );
                                }
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getIsSorted() ? (
                                header.column.getIsSorted() === "asc" ? (
                                  <IconChevronUp className="ml-2 h-4 w-4" />
                                ) : (
                                  <IconChevronDown className="ml-2 h-4 w-4" />
                                )
                              ) : (
                                header.column.getCanSort() && (
                                  <IconChevronUp className="ml-2 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-50" />
                                )
                              )}
                            </div>
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {portfolioTable.getRowModel().rows?.length ? (
                  <SortableContext
                    items={portfolioDataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {portfolioTable.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={portfolioColumns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="mr-auto" />
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${portfolioTable.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  portfolioTable.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={portfolioTable.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {portfolioTable.getState().pagination.pageIndex + 1} of{" "}
              {portfolioTable.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => portfolioTable.setPageIndex(0)}
                disabled={!portfolioTable.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => portfolioTable.previousPage()}
                disabled={!portfolioTable.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => portfolioTable.nextPage()}
                disabled={!portfolioTable.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() =>
                  portfolioTable.setPageIndex(portfolioTable.getPageCount() - 1)
                }
                disabled={!portfolioTable.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="transactions" className="flex flex-col px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {transactionTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="h-12">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {transactionTable.getRowModel().rows.length ? (
                transactionTable.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="h-12">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={transactionColumns.length}
                    className="h-24 text-center"
                  >
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4 mt-4">
          <div className="mr-auto" />
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label
                htmlFor="txn-rows-per-page"
                className="text-sm font-medium"
              >
                Rows per page
              </Label>
              <Select
                value={`${transactionTable.getState().pagination.pageSize}`}
                onValueChange={(value) =>
                  transactionTable.setPageSize(Number(value))
                }
              >
                <SelectTrigger
                  size="sm"
                  className="w-20"
                  id="txn-rows-per-page"
                >
                  <SelectValue
                    placeholder={
                      transactionTable.getState().pagination.pageSize
                    }
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {transactionTable.getState().pagination.pageIndex + 1} of{" "}
              {transactionTable.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => transactionTable.setPageIndex(0)}
                disabled={!transactionTable.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => transactionTable.previousPage()}
                disabled={!transactionTable.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => transactionTable.nextPage()}
                disabled={!transactionTable.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() =>
                  transactionTable.setPageIndex(
                    transactionTable.getPageCount() - 1
                  )
                }
                disabled={!transactionTable.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
