"use client";

import React from "react";
import { useState, useEffect } from "react";
import { columns } from "@/app/(dashboard)/expense-categories/columns";
import { DataTable } from "@/components/ui/data-table";
import ExpenseCategoryDialogForm from "./ExpenseCategoryDialogForm";
import { Button } from "./ui/button";

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

  //console.log(items);
  return (
    <div className="w-full pb-10 px-20">
      <div className="text-4xl py-10 flex justify-between">
        <span>Expense Categories</span>
        <Button onClick={addButtonHandler}>Add Expense Category</Button>
      </div>
      <DataTable
        columns={columns}
        data={expenseCategories}
        openEditFunction={editButtonHandler}
      />

      <ExpenseCategoryDialogForm
        isFormOpen={isExpenseCategoryFormOpen}
        formHandler={handleExpenseCategoryFormOpen}
        expenseCategories={expenseCategoryEditData}
      />
    </div>
  );
};

export default ExpenseCategoriesSection;
