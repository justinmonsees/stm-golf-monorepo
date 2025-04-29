"use client";

import React from "react";
import { useState } from "react";
import { columns } from "@/app/dashboard/(dashboard)/sponsors/columns";
import { DataTable } from "@/components/ui/data-table";
import SponsorDialogForm from "./SponsorDialogForm";
import { Button } from "../ui/button";
import { createSponsorReport } from "@/lib/reports/sponsorReport";
import { exportSponsorsCSV } from "@/lib/csv/sponsorCSV";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SponsorsSection = ({ sponsors, committeeMembers, eventInfo }) => {
  const [sponsorEditData, setSponsorEditData] = useState(null);
  const [isSponsorFormOpen, setSponsorFormOpen] = useState(false);

  const editButtonHandler = (rowData) => {
    setSponsorEditData(rowData);
    handleSponsorFormOpen();
  };

  const addButtonHandler = () => {
    setSponsorEditData(null);
    handleSponsorFormOpen();
  };

  const handleSponsorFormOpen = () => {
    setSponsorFormOpen((prevVal) => !prevVal);
  };

  const generatePDF = async () => {
    createSponsorReport(sponsors, eventInfo);
  };

  const generateCSV = () => {
    exportSponsorsCSV(sponsors, "Sponsors");
  };

  return (
    <div className="w-full pb-10 px-10">
      <div className="py-10 flex justify-between">
        <span className="text-4xl font-bold">Sponsors</span>
        <div className="flex gap-3">
          <Button onClick={addButtonHandler}>Add Sponsor</Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Export</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-65">
              <DropdownMenuLabel>Reports</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={generatePDF}>
                  Sponsors By Committee Member
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
        data={sponsors}
        openEditFunction={editButtonHandler}
        initSortCol={"company"}
      />

      <SponsorDialogForm
        isFormOpen={isSponsorFormOpen}
        formHandler={handleSponsorFormOpen}
        sponsor={sponsorEditData}
        committeeMembers={committeeMembers}
      />
    </div>
  );
};

export default SponsorsSection;
