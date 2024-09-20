"use client";

import { Button } from "@/components/ui/button";

import { SquarePen, SquareX } from "lucide-react";

import { deleteExpenseCategoryByID } from "@/lib/actions/expenseCategoryActions";

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
    enableColumnFilter: false,
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const expenseCategory = row.original;

      return (
        <>
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.options.meta.openEditModal(row.original)}
            >
              <span className="sr-only">Edit Expense Category</span>
              <SquarePen className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                deleteExpenseCategoryByID(expenseCategory.expense_category_id);
                table.options.meta.refreshRoute();
              }}
            >
              <span className="sr-only">Delete Expense Category</span>
              <SquareX className="h-6 w-6" />
            </Button>
          </div>
        </>
      );
    },
    enableColumnFilter: false,
  },
];
