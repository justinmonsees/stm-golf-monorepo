"use client";

import { Button } from "@/components/ui/button";

import { SquarePen, SquareX } from "lucide-react";

import { deleteUserByID } from "@/lib/actions/userActions";

export const columns = [
  {
    id: "user_fullName",
    accessorFn: (row) => `${row.first_name} ${row.last_name}`,
    header: "Full Name",
    enableColumnFilter: false,
    sortingFn: (rowA, rowB, columnId) => {
      const lastNameA = rowA.original.last_name.toLowerCase().charAt(0);
      const lastNameB = rowB.original.last_name.toLowerCase().charAt(0);
      return lastNameA > lastNameB ? 1 : lastNameA < lastNameB ? -1 : 0;
    },
  },

  {
    accessorKey: "role",
    header: "Role",
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    accessorKey: "email",
    header: "Email",
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const user = row.original;

      return (
        <>
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                table.options.meta.openEditModal(row.original);
              }}
            >
              <span className="sr-only">Edit User</span>
              <SquarePen className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                deleteUserByID(user.user_id);
                table.options.meta.refreshRoute();
              }}
            >
              <span className="sr-only">Delete User</span>
              <SquareX className="h-6 w-6" />
            </Button>
          </div>
        </>
      );
    },
    enableColumnFilter: false,
  },
];
