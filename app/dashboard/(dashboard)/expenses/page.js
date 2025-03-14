"use server";

import React from "react";

import { getExpenses } from "@/lib/actions/expenseActions";
import { getExpenseCategories } from "@/lib/actions/expenseCategoryActions";
import { getViewingEvent } from "@/lib/actions/eventActions";
import ExpensesSection from "@/components/dashboard/ExpensesSection";

const Expenses = async () => {
  const [expenses, expenseCategories, currentEvent] = await Promise.all([
    getExpenses(),
    getExpenseCategories(),
    getViewingEvent(),
  ]);

  return (
    <>
      <ExpensesSection
        expenses={expenses}
        expenseCategories={expenseCategories}
        curEvent={currentEvent[0]}
      />
    </>
  );
};

export default Expenses;
