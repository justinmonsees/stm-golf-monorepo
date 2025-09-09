"use client";

import React from "react";
import { useState, useEffect } from "react";
import { columns } from "@/app/dashboard/(dashboard)/attendees/columns";
import { DataTable } from "@/components/ui/data-table";
import EditAttendeeDialog from "./EditAttendeeDialog";
import AddAttendeesDialog from "./AddAttendeesForm/AddAttendeesDialog";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAttendeeContext } from "@/lib/context/attendeesContext";
import { createAttendeeReport } from "@/lib/reports/attendeeReport";
import { exportAttendeesCSV } from "@/lib/csv/attendeeCSV";

//PDF ME TESTING IMPORTS
import * as checkIn from "@/lib/reportTemplates/attendee_check_in";
import { generate } from "@pdfme/generator";

const AttendeesSection = () => {
  const [attendeeEditData, setEditAttendeeData] = useState(null);
  const [isAddAttendeeFormOpen, setAddAttendeeFormOpen] = useState(false);
  const [isEditAttendeeFormOpen, setEditAttendeeFormOpen] = useState(false);

  const { attendees, currentEvent: curEvent } = useAttendeeContext();

  const editButtonHandler = (rowData) => {
    setEditAttendeeData(rowData);
    handleEditAttendeeFormOpen();
  };

  const addButtonHandler = () => {
    handleAddAttendeeFormOpen();
  };

  const handleAddAttendeeFormOpen = () => {
    setAddAttendeeFormOpen((prevVal) => !prevVal);
  };

  const handleEditAttendeeFormOpen = () => {
    setEditAttendeeFormOpen((prevVal) => !prevVal);
  };
  const generatePDF = async () => {
    createAttendeeReport(attendees, curEvent);
  };

  const generateCheckinPDF = async () => {
    const attendeesInput = attendees
      .sort((a, b) => {
        // First, compare by 'last name'
        const lastNameComparison = a["last_name"].localeCompare(b["last_name"]);

        // If last names are different, return the result
        if (lastNameComparison !== 0) {
          return lastNameComparison;
        }

        // If last names are the same, compare by 'first name'
        return a["first_name"].localeCompare(b["first_name"]);
      })
      .reduce((acc, curAttendee) => {
        acc.push([
          `${curAttendee.first_name} ${curAttendee.last_name}`,
          `${curAttendee.Golf_Tee_Groups.hole_number}${curAttendee.Golf_Tee_Groups.hole_letter}`,
        ]);

        return acc;
      }, []);

    const inputs = [
      {
        attendeesTable: attendeesInput,
      },
    ];

    const template = checkIn.template;
    const plugins = checkIn.plugins;

    generate({ template, inputs, plugins }).then((pdf) => {
      // Browser
      const blob = new Blob([pdf.buffer], { type: "application/pdf" });
      window.open(URL.createObjectURL(blob));
    });
  };

  const generateCSV = () => {
    exportAttendeesCSV(attendees, "Attendees");
  };

  //console.log(items);
  return (
    <div className="w-full pb-10 px-10">
      <div className=" py-10 flex justify-between">
        <span className="text-4xl font-bold">Attendees</span>
        <div className="flex gap-3">
          <Button
            disabled={!curEvent.is_current_event}
            onClick={addButtonHandler}
          >
            Add Attendee
          </Button>
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
              <DropdownMenuItem onClick={generateCheckinPDF}>
                Check In Form
              </DropdownMenuItem>
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
        initSortCol={"fullName"}
        disableButtons={!curEvent.is_current_event}
      />

      <EditAttendeeDialog
        isFormOpen={isEditAttendeeFormOpen}
        formHandler={handleEditAttendeeFormOpen}
        attendee={attendeeEditData}
      />
      <AddAttendeesDialog
        isFormOpen={isAddAttendeeFormOpen}
        formHandler={handleAddAttendeeFormOpen}
      />
    </div>
  );
};

export default AttendeesSection;
