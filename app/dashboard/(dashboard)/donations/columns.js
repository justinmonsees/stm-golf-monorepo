"use client";

import { Button } from "@/components/ui/button";

import { SquarePen, SquareX } from "lucide-react";

import { deleteDonationByID } from "@/lib/actions/donationActions";

export const columns = [
  {
    id: "sponsor",
    accessorFn: (row) => row.sponsor.company_name,
    header: "Sponsor",
    enableColumnFilter: false,
    sortingFn: (rowA, rowB, columnId) => {
      const sponsorA = rowA.original.sponsor.company_name.toLowerCase();
      const sponsorB = rowB.original.sponsor.company_name.toLowerCase();
      return sponsorA > sponsorB ? 1 : sponsorA < sponsorB ? -1 : 0;
    },
  },
  {
    id: "items",
    accessorFn: (row) => `${row.item.name}`,
    header: "Item",
    enableColumnFilter: true,
  },
  {
    id: "amount_received",
    accessorKey: "amount_received",
    header: "Amount Received",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount_received"));
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
    id: "actions",
    cell: ({ row, table }) => {
      const item = row.original;

      return (
        <>
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={table.options.meta.disableButtons}
              onClick={() => table.options.meta.openEditModal(row.original)}
            >
              <span className="sr-only">Edit Donation</span>
              <SquarePen className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={table.options.meta.disableButtons}
              onClick={() => {
                deleteDonationByID(donation.donation_id);
                table.options.meta.refreshRoute();
              }}
            >
              <span className="sr-only">Delete Donation</span>
              <SquareX className="h-6 w-6" />
            </Button>
          </div>
        </>
      );
    },
    enableColumnFilter: false,
  },
];
