"use server";

import { createClient } from "@/utils/supabase/server";

/**********************************************************************************
 * CREATE: addExpense
 *
 * This function accepts expense data and creates a new expense in the
 * database. The event_id must be included in the data object.
 *
 **********************************************************************************/

export async function addExpense(data) {
  const supabase = await createClient();

  const { error } = await supabase.from("Expenses").insert(data);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Expense Created Successfully", error: null };
  }
}

/**********************************************************************************
 * READ: getExpenses
 *
 * This function will get all of the expenses based on the event
 * that has the is_viewing_event field marked as true
 *
 **********************************************************************************/

export async function getExpenses() {
  const supabase = await createClient();

  //first get the currently viewed event id
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

/**********************************************************************************
 * UPDATE: updateExpenseByID
 *
 * This function accepts an expense ID and the data for an expense that
 * needs to be updated
 *
 **********************************************************************************/

export async function updateExpenseByID(id, data) {
  const supabase = await createClient();
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

/**********************************************************************************
 * DELETE: deleteExpenseByID
 *
 * This function will delete a single expense from the database given
 * an expense_id
 *
 **********************************************************************************/

export async function deleteExpenseByID(id) {
  const supabase = await createClient();
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
