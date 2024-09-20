"use client";

import { Button } from "@/components/ui/button";

import { SquarePen, SquareX } from "lucide-react";

import { deleteSponsorByID } from "@/lib/actions/sponsorActions";

export const columns = [
  {
    id: "company",
    accessorKey: "company_name",
    header: "Name",
    enableColumnFilter: false,
    enableSorting: true,
  },
  {
    id: "contact_fullName",
    accessorFn: (row) => `${row.contact_first_name} ${row.contact_last_name}`,
    header: "Full Name",
    enableColumnFilter: false,
    sortingFn: (rowA, rowB, columnId) => {
      const lastNameA = rowA.original.contact_last_name.toLowerCase().charAt(0);
      const lastNameB = rowB.original.contact_last_name.toLowerCase().charAt(0);
      return lastNameA > lastNameB ? 1 : lastNameA < lastNameB ? -1 : 0;
    },
  },
  {
    accessorKey: "business_phone_number",
    header: "Business Phone #",
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    accessorKey: "contact_phone_number",
    header: "Contact Phone #",
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    id: "solicitor",
    header: "Solicitor",
    cell: ({ row }) => {
      return (
        <span>
          {row.original.committee_members
            ? row.original.committee_members.first_name.charAt(0) +
              row.original.committee_members.last_name.charAt(0)
            : ""}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const sponsor = row.original;

      return (
        <>
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.options.meta.openEditModal(row.original)}
            >
              <span className="sr-only">Edit Sponsor</span>
              <SquarePen className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                deleteSponsorByID(sponsor.sponsor_id);
                table.options.meta.refreshRoute();
              }}
            >
              <span className="sr-only">Delete Sponsor</span>
              <SquareX className="h-6 w-6" />
            </Button>
          </div>
        </>
      );
    },
    enableColumnFilter: false,
  },
];
