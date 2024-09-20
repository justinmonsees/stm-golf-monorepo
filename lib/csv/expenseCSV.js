"use client";

import { downloadCSV } from "@/utils/csvGenerator";

export function exportExpensesCSV(expenses, fileName = "download") {
  const expenseDataArr = reformatExpenseDataForCSV(expenses);

  downloadCSV(expenseDataArr, fileName);
}

function reformatExpenseDataForCSV(expenses) {
  const expenseArr = [
    ["Vendor", "Description", "Category", "Amount", "Date Paid"],
  ];

  Object.values(expenses).map((expense) => {
    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(expense.amount_paid);

    expenseArr.push([
      expense.name ? `\"${expense.name}\"` : "",
      expense.description ? `\"${expense.description}\"` : "",
      expense.expense_category.name
        ? `\"${expense.expense_category.name}\"`
        : "",
      `\"${formattedAmount}\"`,
      expense.date_paid ? `\"${expense.date_paid}\"` : "",
    ]);
  });

  return expenseArr;
}
