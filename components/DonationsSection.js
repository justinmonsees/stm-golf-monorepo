"use client";

import React from "react";
import { useState, useEffect } from "react";
import { columns } from "@/app/(dashboard)/donations/columns";
import { DataTable } from "@/components/ui/data-table";
import DonationDialogForm from "./DonationDialogForm";
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
import { createDonationReport } from "@/lib/reports/donationReport";
import { exportDonationsCSV } from "@/lib/csv/donationCSV";

const DonationsSection = ({ donations, items, sponsors, curEvent }) => {
  const [donationEditData, setEditDonationData] = useState(null);
  const [isDonationFormOpen, setDonationFormOpen] = useState(false);

  const editButtonHandler = (rowData) => {
    setEditDonationData(rowData);
    handleDonationFormOpen();
  };

  const addButtonHandler = () => {
    setEditDonationData(null);
    handleDonationFormOpen();
  };

  const handleDonationFormOpen = () => {
    setDonationFormOpen((prevVal) => !prevVal);
  };

  const generatePDF = async () => {
    createDonationReport(donations, curEvent);
  };

  const generateCSV = () => {
    exportDonationsCSV(donations, "Donations");
  };

  return (
    <div className="w-full pb-10 px-10">
      <div className="text-4xl py-10 flex justify-between">
        <span>Donations</span>
        <div className="flex gap-3">
          <Button
            disabled={curEvent.is_current_event}
            onClick={addButtonHandler}
          >
            Add Donation
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
                  Donations By Category
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
        data={donations}
        openEditFunction={editButtonHandler}
        initSortCol={"sponsor"}
        disableButtons={curEvent.is_current_event}
      />

      <DonationDialogForm
        isFormOpen={isDonationFormOpen}
        formHandler={handleDonationFormOpen}
        donation={donationEditData}
        items={items}
        sponsors={sponsors}
        curEvent={curEvent}
      />
    </div>
  );
};

export default DonationsSection;
