"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**********************************************************************************
 * CREATE: addAttendees
 *
 * This function accepts an array of attendee data and creates new attendees in the
 * database. It also takes in the new registration Group ID so that it can create a
 * new regration group in the database.
 *
 **********************************************************************************/

export async function addAttendees(data, regGroupID) {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      result: "Error Occured",
      error: "Invalid or empty attendee data.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("Attendees")
    .upsert(data, { onConflict: "attendee_id", ignoreDuplicates: false });

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Attendees Created Successfully", error: null };
  }
}

/**********************************************************************************
 * READ: getAttendees
 *
 * This function will get all of the attendees based on the event
 * that has the is_viewing_event field marked as true
 *
 **********************************************************************************/

export async function getAttendees() {
  const supabase = await createClient();

  //first get the currently viewing event id
  const { data: curEvent } = await supabase
    .from("Events")
    .select("event_id")
    .eq("is_viewing_event", true);

  const curEventID = curEvent[0].event_id;

  const { data: attendees, error } = await supabase
    .from("Attendees")
    .select("*,Golf_Tee_Groups(hole_number,hole_letter)")
    .eq("event_id", curEventID);

  return attendees;
}

/**********************************************************************************
 * UPDATE: updateAttendeeByID
 *
 * This function accepts a user ID and the data for a user that
 * needs to be updated
 *
 **********************************************************************************/

export async function updateAttendeeByID(id, data) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("Attendees")
    .update(data)
    .eq("attendee_id", id);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    revalidatePath("/tee-assignments", "page");
    return { result: "Changes Made Successfully", error: null };
  }
}

/**********************************************************************************
 * UPDATE: bulkUpdateAttendees
 *
 * This function accepts a attendee data array and uses Supabase upsert to
 * update multiple attendees in one call.
 * **NOTE: attendee_id must be included in the object
 *
 **********************************************************************************/

export async function bulkUpdateAttendees(data) {
  let noIdError = null;

  data.forEach((attendeeObj) => {
    if (!attendeeObj.hasOwnProperty("attendee_id")) {
      noIdError = true;
    }
  });
  if (noIdError) {
    return {
      result: "Error Occured",
      error: "One or more objects is missing an attendee ID",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("Attendees")
    .upsert(data, { onConflict: "attendee_id", ignoreDuplicates: false });

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    revalidatePath("/tee-assignments", "page");
    return { result: "Changes Made Successfully", error: null };
  }
}

/**********************************************************************************
 * DELETE: deleteAttendeeByID
 *
 * This function will delete a single attendee from the database given an
 * attendee_id
 *
 **********************************************************************************/

export async function deleteAttendeeByID(id) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("Attendees")
    .delete()
    .eq("attendee_id", id);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Changes Made Successfully", error: null };
  }
}
