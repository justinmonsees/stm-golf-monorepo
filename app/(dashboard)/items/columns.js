"use client";

import { Button } from "@/components/ui/button";

import { SquarePen, SquareX } from "lucide-react";

import { deleteItemByID } from "@/lib/actions/itemActions";

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
    enableColumnFilter: false,
  },
  {
    accessorKey: "cost",
    header: "Cost",
    cell: ({ row }) => {
      const cost = parseFloat(row.getValue("cost"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(cost);

      return <div>{formatted}</div>;
    },
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    accessorKey: "item_type",
    header: "Type",
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const item = row.original;

      return (
        <>
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.options.meta.openEditModal(row.original)}
            >
              <span className="sr-only">Edit Item</span>
              <SquarePen className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                deleteItemByID(item.item_id);
                table.options.meta.refreshRoute();
              }}
            >
              <span className="sr-only">Delete Item</span>
              <SquareX className="h-6 w-6" />
            </Button>
          </div>
        </>
      );
    },
    enableColumnFilter: false,
  },
];
