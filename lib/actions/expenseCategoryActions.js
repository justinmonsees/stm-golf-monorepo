"use server";

import { createClient } from "@/utils/supabase/server";

/*This Function will add an item to the database. It will first check to see if item exists
in the inactive state. If it does, it will set the is_active property to TRUE. If the item does 
not exist in the database it will be created. */
export async function addExpenseCategory(data) {
  const supabase = createClient();

  const { data: categories } = await supabase
    .from("Expense_Categories")
    .select("*");

  const existingCategory = categories.find(
    (category) => category.name.toLowerCase() === data.name.toLowerCase()
  );
  //console.log("EXISTING CATEGORY", existingCategory);
  let error = null;

  if (existingCategory) {
    if (existingCategory.is_active === false) {
      //console.log("UPDATING PREVIOUS CATEGORY");
      let { error } = await supabase
        .from("Expense_Categories")
        .update({ ...data, is_active: true })
        .eq("expense_category_id", existingCategory.expense_category_id);
    } else {
      //console.log("Expense Category exists already.");
      error =
        "Expense Category already exists. Create a new category or edit the existing category.";
    }
  } else {
    //console.log("CREATING A NEW EXPENSE CATEGORY");
    let { error } = await supabase.from("Expense_Categories").insert(data);
  }

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Expense Category Created Successfully", error: null };
  }
}

export async function getExpenseCategories() {
  const supabase = createClient();
  const { data: categories, error } = await supabase
    .from("Expense_Categories")
    .select("*")
    .eq("is_active", true);

  return categories;
}

export async function updateExpenseCategoryByID(id, data) {
  const supabase = createClient();
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

//This function will set the value for is_active for the item to false. Expense Categories cannot be fully deleted
// in the database to protect the data integrity. Instead the category can be deactivated. When a new category
// is created, it will first check to see if the category exists in the deactivated status before creating
// a new category in the database.
export async function deleteExpenseCategoryByID(id) {
  const supabase = createClient();
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
