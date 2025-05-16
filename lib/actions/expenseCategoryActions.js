"use server";

import { createClient } from "@/utils/supabase/server";

/**********************************************************************************
 * CREATE: addExpenseCategory
 *
 * This Function will add an expense category to the database. It will first check
 * to see if the expense category exists in the inactive state. If it does, it will
 * set the is_active property to TRUE. If the expense category does not exist in the
 * database it will be created.
 *
 **********************************************************************************/

export async function addExpenseCategory(data) {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("Expense_Categories")
    .select("*");

  const existingCategory = categories.find(
    (category) => category.name.toLowerCase() === data.name.toLowerCase()
  );

  let error = null;

  if (existingCategory) {
    if (existingCategory.is_active === false) {
      //if the expense category exists, updated it's is_active value to true
      let { error: updateError } = await supabase
        .from("Expense_Categories")
        .update({ ...data, is_active: true })
        .eq("expense_category_id", existingCategory.expense_category_id);

      if (updateError) {
        error = updateError;
      }
    } else {
      //otherwise if the expense category exists and it's already active, let the user know
      error = {
        message:
          "Expense Category already exists. Create a new category or edit the existing category.",
      };
    }
  } else {
    //if the expense category doens't exist at all, create a new one
    let { error: insertError } = await supabase
      .from("Expense_Categories")
      .insert(data);

    if (insertError) {
      error = insertError;
    }
  }

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Expense Category Created Successfully", error: null };
  }
}

/**********************************************************************************
 * READ: getExpenseCategories
 *
 * This function will get all of the expense categories. Expense categories
 * are not event specific. Categories will be returned as a sorted array by name.
 *
 **********************************************************************************/

export async function getExpenseCategories() {
  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from("Expense_Categories")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return categories;
}

/**********************************************************************************
 * UPDATE: updateExpenseCategoryByID
 *
 * This function accepts an expense category ID and the data for an expense category
 * that needs to be updated
 *
 **********************************************************************************/

export async function updateExpenseCategoryByID(id, data) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("Expense_Categories")
    .update(data)
    .eq("expense_category_id", id);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Changes Made Successfully", error: null };
  }
}

/**********************************************************************************
 * DELETE: deleteDonationByID
 *
 * This function accepts and expense category id and will set the value for
 * is_active for the expense category to false.
 *
 * Expense Categories cannot be fully deleted in the database to
 * protect the data integrity. Instead the category can be deactivated.
 *
 * When a new category is created, it will first check to see if the
 * category exists in the deactivated status before creating a new category in
 * the database.
 *
 **********************************************************************************/

export async function deleteExpenseCategoryByID(id) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("Expense_Categories")
    .update({ is_active: false })
    .eq("expense_category_id", id);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Changes Made Successfully", error: null };
  }
}
