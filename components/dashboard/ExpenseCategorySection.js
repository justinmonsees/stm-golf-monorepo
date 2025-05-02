"use client";

import React from "react";
import { useState, useEffect } from "react";
import { columns } from "@/app/dashboard/(dashboard)/expense-categories/columns";
import { DataTable } from "@/components/ui/data-table";
import ExpenseCategoryDialogForm from "./ExpenseCategoryDialogForm";
import { Button } from "../ui/button";

const ExpenseCategoriesSection = ({ expenseCategories }) => {
  const [expenseCategoryEditData, setEditExpenseCategoryData] = useState(null);
  const [isExpenseCategoryFormOpen, setExpenseCategoryFormOpen] =
    useState(false);

  const editButtonHandler = (rowData) => {
    setEditExpenseCategoryData(rowData);
    handleExpenseCategoryFormOpen();
  };

  const addButtonHandler = () => {
    setEditExpenseCategoryData(null);
    handleExpenseCategoryFormOpen();
  };

  const handleExpenseCategoryFormOpen = () => {
    setExpenseCategoryFormOpen((prevVal) => !prevVal);
  };

  return (
    <div className="w-full pb-10 px-10">
      <div className=" py-10 flex justify-between">
        <span className="text-4xl font-bold">Expense Categories</span>
        <Button onClick={addButtonHandler}>Add Expense Category</Button>
      </div>
      <DataTable
        columns={columns}
        data={expenseCategories}
        openEditFunction={editButtonHandler}
        initSortCol={"name"}
      />

      <ExpenseCategoryDialogForm
        isFormOpen={isExpenseCategoryFormOpen}
        formHandler={handleExpenseCategoryFormOpen}
        expenseCategory={expenseCategoryEditData}
      />
    </div>
  );
};

export default ExpenseCategoriesSection;
