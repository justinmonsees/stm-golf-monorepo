"use server";

import { createClient } from "@/utils/supabase/server";

export async function getDonations(curEventID) {
  const supabase = createClient();

  const { data: donations, error } = await supabase
    .from("Donations")
    .select("*,sponsor:Sponsors(company_name),item:Items(name)")
    .eq("event_id", curEventID);

  return donations;
}

/*This Function will add a donation to the database. */
export async function addDonation(data) {
  const supabase = createClient();

  const { error } = await supabase.from("Donations").insert(data);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Donation Created Successfully", error: null };
  }
}

export async function updateDonationByID(id, data) {
  const supabase = createClient();
  const { error } = await supabase
    .from("Donations")
    .update(data)
    .eq("donaton_id", id);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Changes Made Successfully", error: null };
  }
}

//This function will set the value for is_active for the item to false. Items cannot be fully deleted
// in the database to protect the data integrity. Instead the item can be deactivated. When a new item
// is created, it will first check to see if the item exists in the deactivated status before creating
// a new item in the database.
export async function deleteDonationByID(id) {
  const supabase = createClient();
  const { error } = await supabase
    .from("Donations")
    .delete()
    .eq("donation_id", id);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Donation Deleted Successfully", error: null };
  }
}
