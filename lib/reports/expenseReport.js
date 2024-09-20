"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function createExpenseReport(expenses, eventInfo) {
  const allExpenses = reformatExpenseData(expenses);
  const totalExpenses = getExpensesTotal(expenses);

  const doc = new jsPDF({ orientation: "p", unit: "in", format: "letter" });

  const reportTitle = "Expense Report";

  const tableHeader = [
    "Name",
    "Description",
    "Category",
    "Amount",
    "Date Paid",
  ];

  doc.text([`${eventInfo.event_name}`, `${reportTitle}`], 0.5, 0.5);

  autoTable(doc, {
    startY: 1,
    head: [tableHeader],
    body: allExpenses,
  });

  doc.text(
    `Total expenses: ${totalExpenses}`,
    0.5,
    doc.lastAutoTable.finalY + 0.5
  );

  addFooters(doc);
  doc.save(`${reportTitle}.pdf`);
}

const addFooters = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();

  doc.setFontSize(8);

  for (var i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    //add the date the report was generated
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 0.5, 10.5);

    //add page numbers
    doc.text("Page " + String(i) + " of " + String(pageCount), 8, 10.5, {
      align: "right",
    });
  }
};

const reformatExpenseData = (expenses) => {
  const formattedExpenses = expenses.reduce((acc, cur) => {
    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cur.amount_paid);

    acc.push([
      cur.name,
      cur.description,
      cur.expense_category.name,
      formattedAmount,
      cur.date_paid,
    ]);

    return acc;
  }, []);

  return formattedExpenses;
};

const getExpensesTotal = (expenses) => {
  const total = expenses.reduce((acc, cur) => {
    acc += cur.amount_paid;
    return acc;
  }, 0);

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(total);

  return formattedTotal;
};
