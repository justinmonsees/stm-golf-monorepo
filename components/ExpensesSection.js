"use client";

import React from "react";
import { useState, useEffect } from "react";
import { columns } from "@/app/(dashboard)/expenses/columns";
import { DataTable } from "@/components/ui/data-table";

import ExpenseDialogForm from "./ExpenseDialogForm";
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
import { createExpenseReport } from "@/lib/reports/expenseReport";
import { exportExpensesCSV } from "@/lib/csv/expenseCSV";

const ExpensesSection = ({ expenses, expenseCategories, curEvent }) => {
  const [expenseEditData, setEditExpenseData] = useState(null);
  const [isExpenseFormOpen, setExpenseFormOpen] = useState(false);

  const editButtonHandler = (rowData) => {
    setEditExpenseData(rowData);
    handleExpenseFormOpen();
  };

  const addButtonHandler = () => {
    setEditExpenseData(null);
    handleExpenseFormOpen();
  };

  const handleExpenseFormOpen = () => {
    setExpenseFormOpen((prevVal) => !prevVal);
  };

  const generatePDF = async () => {
    createExpenseReport(expenses, curEvent);
  };

  const generateCSV = () => {
    exportExpensesCSV(expenses, "Expenses");
  };

  return (
    <div className="w-full pb-10 px-10">
      <div className="py-10 flex justify-between">
        <span className="text-4xl font-bold">Expenses</span>
        <div className="flex gap-3">
          <Button
            disabled={curEvent.is_current_event}
            onClick={addButtonHandler}
          >
            Add Expense
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
                  Expenses
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
        data={expenses}
        openEditFunction={editButtonHandler}
        initSortCol={"name"}
        disableButtons={curEvent.is_current_event}
      />

      <ExpenseDialogForm
        isFormOpen={isExpenseFormOpen}
        formHandler={handleExpenseFormOpen}
        expense={expenseEditData}
        expenseCategories={expenseCategories}
        curEvent={curEvent}
      />
    </div>
  );
};

export default ExpensesSection;
