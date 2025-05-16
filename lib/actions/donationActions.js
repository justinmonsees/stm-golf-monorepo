"use server";

import { createClient } from "@/utils/supabase/server";

/**********************************************************************************
 * CREATE: addDonation
 *
 * This function accepts donation data and creates a new donation in the
 * database. The event_id must be included in the data object.
 *
 **********************************************************************************/

export async function addDonation(data) {
  const supabase = await createClient();

  const { error } = await supabase.from("Donations").insert(data);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Donation Created Successfully", error: null };
  }
}

/**********************************************************************************
 * READ: getDonations
 *
 * This function will get all of the donations based on the event
 * that has the is_viewing_event field marked as true
 *
 **********************************************************************************/

export async function getDonations() {
  const supabase = await createClient();

  //first get the currently viewing event id
  const { data: curEvent } = await supabase
    .from("Events")
    .select("event_id")
    .eq("is_viewing_event", true);

  const curEventID = curEvent[0].event_id;

  const { data: donations, error } = await supabase
    .from("Donations")
    .select("*,sponsor:Sponsors(company_name),item:Items(name)")
    .eq("event_id", curEventID);

  return donations;
}

/**********************************************************************************
 * UPDATE: updateDonationByID
 *
 * This function accepts a donation ID and the data for a donation that
 * needs to be updated
 *
 **********************************************************************************/

export async function updateDonationByID(id, data) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("Donations")
    .update(data)
    .eq("donation_id", id);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Changes Made Successfully", error: null };
  }
}

/**********************************************************************************
 * DELETE: deleteDonationByID
 *
 * This function will delete a single donation from the database given
 * a donation_id
 *
 **********************************************************************************/

export async function deleteDonationByID(id) {
  const supabase = await createClient();

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
