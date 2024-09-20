"use client";

import React from "react";
import { useState, useEffect } from "react";
import { columns } from "@/app/(dashboard)/attendees/columns";
import { DataTable } from "@/components/ui/data-table";
import AttendeeDialogForm from "./AttendeeDialogForm";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { createAttendeeReport } from "@/lib/reports/attendeeReport";
import { exportAttendeesCSV } from "@/lib/csv/attendeeCSV";

const AttendeesSection = ({ attendees, curEvent }) => {
  const [attendeeEditData, setEditAttendeeData] = useState(null);
  const [isAttendeeFormOpen, setAttendeeFormOpen] = useState(false);

  const editButtonHandler = (rowData) => {
    setEditAttendeeData(rowData);
    handleAttendeeFormOpen();
  };

  const addButtonHandler = () => {
    setEditAttendeeData(null);
    handleAttendeeFormOpen();
  };

  const handleAttendeeFormOpen = () => {
    setAttendeeFormOpen((prevVal) => !prevVal);
  };
  const generatePDF = async () => {
    createAttendeeReport(attendees, curEvent);
  };

  const generateCSV = () => {
    exportAttendeesCSV(attendees, "Attendees");
  };

  //console.log(items);
  return (
    <div className="w-full pb-10 px-20">
      <div className="text-4xl py-10 flex justify-between">
        <span>Attendees</span>
        <div className="flex gap-3">
          <Button onClick={addButtonHandler}>Add Attendee</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Export</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-65">
              <DropdownMenuLabel>Reports</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={generatePDF}>
                  Attendees By Type
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Data</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={generateCSV}>CSV</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={attendees}
        openEditFunction={editButtonHandler}
      />

      <AttendeeDialogForm
        isFormOpen={isAttendeeFormOpen}
        formHandler={handleAttendeeFormOpen}
        attendee={attendeeEditData}
      />
    </div>
  );
};

export default AttendeesSection;
