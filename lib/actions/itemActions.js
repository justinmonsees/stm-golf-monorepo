"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**********************************************************************************
 * CREATE: addItem
 *
 * This Function will add an item to the database. It will first check to see if
 * item exists in the inactive state. If it does, it will set the is_active
 * property to TRUE. If the item does not exist in the database it will be created.
 *
 **********************************************************************************/

export async function addItem(data) {
  const supabase = await createClient();

  const { data: items } = await supabase.from("Items").select("*");

  const existingItem = items.find(
    (item) => item.name.toLowerCase() === data.name.toLowerCase()
  );

  let error = null;

  if (existingItem) {
    if (existingItem.is_active === false) {
      //UPDATING PREVIOUS ITEM
      let { error: updateError } = await supabase
        .from("Items")
        .update({ ...data, is_active: true })
        .eq("item_id", existingItem.item_id);

      if (updateError) {
        error = updateError;
      }
    } else {
      //Item exists already
      error = {
        message:
          "Item already exists. Create a new item or edit the existing item.",
      };
    }
  } else {
    //CREATING A NEW ITEM
    let { error: insertError } = await supabase.from("Items").insert(data);

    if (insertError) {
      error = insertError;
    }
  }

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    revalidatePath("/home", "page");
    revalidatePath("/donate", "page");
    revalidatePath("/register", "page");
    return { result: "Item Created Successfully", error: null };
  }
}

/**********************************************************************************
 * READ: getItems
 *
 * This function will get all of the items that are active and returns a
 * sorted array by name
 *
 **********************************************************************************/

export async function getItems() {
  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from("Items")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return items;
}

/**********************************************************************************
 * READ: getSponsorItems
 *
 * This function will get only the items that are active and have an item_type set
 * to "sponsor".
 **********************************************************************************/

export async function getSponsorItems() {
  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from("Items")
    .select("*")
    .eq("is_active", true)
    .eq("item_type", "sponsor");

  //get the public urls for the images
  items.map(
    (item) =>
      (item.item_image = supabase.storage
        .from("public_images/sponsorships")
        .getPublicUrl(item.item_image).data.publicUrl)
  );

  return items;
}

/**********************************************************************************
 * READ: getAttendeeItems
 *
 * This function will get only the items that are active and have an item_type set
 * to "attendee".
 **********************************************************************************/

export async function getAttendeeItems() {
  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from("Items")
    .select("*")
    .eq("is_active", true)
    .eq("item_type", "attendee");

  return items;
}

/**********************************************************************************
 * READ: getNonAttendeeItems
 *
 * This function will get only the items that are active and have an item_type
 * that is NOT set to "attendee".
 **********************************************************************************/

export async function getNonAttendeeItems() {
  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from("Items")
    .select("*")
    .eq("is_active", true)
    .neq("item_type", "attendee")
    .order("name", { ascending: true });

  return items;
}

/**********************************************************************************
 * UPDATE: updateItemByID
 *
 * This function accepts an item ID and the data for an item that
 * needs to be updated
 *
 * This will also revalidate the home, donate, and register pages to regenerate
 * those pages so the changes show up on the public site
 *
 **********************************************************************************/

export async function updateItemByID(id, data) {
  const supabase = await createClient();
  const { error } = await supabase.from("Items").update(data).eq("item_id", id);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    revalidatePath("/home", "page");
    revalidatePath("/donate", "page");
    revalidatePath("/register", "page");
    return { result: "Changes Made Successfully", error: null };
  }
}

/**********************************************************************************
 * DELETE: deleteItemByID
 *
 * This function will set the value for is_active for the item to false. Items
 * cannot be fully deleted in the database to protect the data integrity.
 * Instead the item can be deactivated.
 *
 * When a new item is created, it will first check to see if the item exists
 * in the deactivated status before creating a new item in the database.
 *
 * This will also revalidate the home, donate, and register pages to regenerate
 * those pages so the changes show up on the public site
 *
 **********************************************************************************/

export async function deleteItemByID(id) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("Items")
    .update({ is_active: false })
    .eq("item_id", id);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    revalidatePath("/home", "page");
    revalidatePath("/donate", "page");
    revalidatePath("/register", "page");
    return { result: "Changes Made Successfully", error: null };
  }
}
