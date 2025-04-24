"use server";

import { createClient } from "@/utils/supabase/server";

/*This Function will add an expense to the database. */
export async function addExpense(data) {
  const supabase = createClient();

  const { error } = await supabase.from("Expenses").insert(data);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Expense Created Successfully", error: null };
  }
}

export async function getExpenses() {
  const supabase = createClient();

  //first get the current event id based on which event is being VIEWED
  const { data: curEvent } = await supabase
    .from("Events")
    .select("event_id")
    .eq("is_viewing_event", true);

  const curEventID = curEvent[0].event_id;

  const { data: expenses, error } = await supabase
    .from("Expenses")
    .select("*,expense_category:Expense_Categories(name)")
    .eq("event_id", curEventID);

  return expenses;
}

export async function updateExpenseByID(id, data) {
  const supabase = createClient();
  const { error } = await supabase
    .from("Expenses")
    .update(data)
    .eq("expense_id", id);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Changes Made Successfully", error: null };
  }
}

//This function will delete an expense from the database

export async function deleteExpenseByID(id) {
  const supabase = createClient();
  const { error } = await supabase
    .from("Expenses")
    .delete()
    .eq("expense_id", id);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Changes Made Successfully", error: null };
  }
}
