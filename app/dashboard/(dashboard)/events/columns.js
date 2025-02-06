"use client";

import { Button } from "@/components/ui/button";

import { SquarePen, SquareX, Eye } from "lucide-react";
import { convertToLocalDate } from "@/lib/helpers";
import { setViewingEvent } from "@/lib/actions/eventActions";
import { format } from "date-fns";

export const columns = [
  {
    id: "visibility",
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row, table }) => {
      if (row.original.is_viewing_event === true) {
        return (
          <>
            <Button variant="ghost" size="icon" disabled={true}>
              <Eye className="h-6 w-6" color="green" />
            </Button>
          </>
        );
      } else {
        return (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setViewingEvent(row.original.event_id);
                table.options.meta.refreshRoute();
              }}
            >
              <Eye className="h-6 w-6" color="gray" />
            </Button>
          </>
        );
      }
    },
  },
  {
    id: "eventDate",
    accessorKey: "event_date",
    header: "Date",
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ row }) => {
      if (row.original.event_date) {
        const localDate = convertToLocalDate(row.original.event_date);

        return format(localDate, "P");
      } else {
        return "N/A";
      }
    },
    sortingFn: (rowA, rowB, columnId) => {
      const eventDateA = rowA.original.event_date;
      const eventDateB = rowB.original.event_date;
      return eventDateA > eventDateB ? 1 : eventDateA < eventDateB ? -1 : 0;
    },
  },
  {
    accessorKey: "venue_name",
    header: "Venue",
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "start_time",
    header: "Start Time",
    enableSorting: false,
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
              <span className="sr-only">Edit Event</span>
              <SquarePen className="h-6 w-6" />
            </Button>
          </div>
        </>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
  },
];
