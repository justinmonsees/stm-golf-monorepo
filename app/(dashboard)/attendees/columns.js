"use client";

import { Button } from "@/components/ui/button";

import { SquarePen, SquareX } from "lucide-react";
import { convertToLocalDate } from "@/lib/helpers";
import { deleteAttendeeByID } from "@/lib/actions/attendeeActions";

const ITEM_TYPES = [
  { label: "Attendee", filter: "attendee" },
  { label: "Sponsor", filter: "sponsor" },
  { label: "All", filter: "" },
];

export const columns = [
  {
    accessorKey: "fullName",
    header: "Full Name",
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <span>
          {row.original.first_name} {row.original.last_name}
        </span>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      const lastNameA = rowA.original.last_name.toLowerCase().charAt(0);
      const lastNameB = rowB.original.last_name.toLowerCase().charAt(0);
      return lastNameA > lastNameB ? 1 : lastNameA < lastNameB ? -1 : 0;
    },
  },
  {
    accessorKey: "paid",
    header: "Pmt Status",
    enableColumnFilter: false,
    cell: ({ row }) => {
      if (row.original.paid) {
        return <div className="bg-green-700 text-white text-center">Yes</div>;
      } else {
        return <div className="bg-red-700 text-white text-center">No</div>;
      }
    },
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
    accessorKey: "attendee_type",
    header: "Type",
    enableColumnFilter: false,
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const attendee = row.original;

      return (
        <>
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.options.meta.openEditModal(row.original)}
            >
              <span className="sr-only">Edit Attendee</span>
              <SquarePen className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                deleteAttendeeByID(attendee.attendee_id);
                table.options.meta.refreshRoute();
              }}
            >
              <span className="sr-only">Delete Attendee</span>
              <SquareX className="h-6 w-6" />
            </Button>
          </div>
        </>
      );
    },
    enableColumnFilter: false,
  },
];
