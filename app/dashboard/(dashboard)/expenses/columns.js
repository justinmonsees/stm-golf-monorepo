"use client";

import { Button } from "@/components/ui/button";

import { SquarePen, SquareX } from "lucide-react";
import { convertToLocalDate } from "@/lib/helpers";
import { deleteExpenseByID } from "@/lib/actions/expenseActions";

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
    enableColumnFilter: false,
    sortingFn: (rowA, rowB, columnId) => {
      const companyA = rowA.original.name.toLowerCase();
      const companyB = rowB.original.name.toLowerCase();
      return companyA > companyB ? 1 : companyA < companyB ? -1 : 0;
    },
  },

  {
    accessorKey: "description",
    header: "Description",
    enableColumnFilter: false,
  },
  {
    id: "category",
    accessorFn: (row) => row.expense_category.name,
    header: "Category",
  },
  {
    id: "amount_paid",
    accessorKey: "amount_paid",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount_paid"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div>{formatted}</div>;
    },
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    accessorKey: "datePaid",
    header: "Date Paid",
    enableColumnFilter: false,
    cell: ({ row }) => {
      if (row.original.date_paid) {
        const localDate = convertToLocalDate(row.original.date_paid);

        return localDate.toLocaleString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
      } else {
        return "N/A";
      }
    },
  },

  {
    id: "actions",
    cell: ({ row, table }) => {
      const expense = row.original;

      return (
        <>
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={table.options.meta.disableButtons}
              onClick={() => table.options.meta.openEditModal(row.original)}
            >
              <span className="sr-only">Edit Expense</span>
              <SquarePen className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={table.options.meta.disableButtons}
              onClick={() => {
                deleteExpenseByID(expense.expense_id);
                table.options.meta.refreshRoute();
              }}
            >
              <span className="sr-only">Delete Expense</span>
              <SquareX className="h-6 w-6" />
            </Button>
          </div>
        </>
      );
    },
    enableColumnFilter: false,
  },
];
