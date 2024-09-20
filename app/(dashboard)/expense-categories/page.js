"use server";

import React from "react";

import { getExpenseCategories } from "@/lib/actions/expenseCategoryActions";
import ExpenseCategoriesSection from "@/components/ExpenseCategorySection";

const ExpenseCategories = async () => {
  const expenseCategories = await getExpenseCategories();

  return (
    <>
      <ExpenseCategoriesSection expenseCategories={expenseCategories} />
    </>
  );
};

export default ExpenseCategories;
