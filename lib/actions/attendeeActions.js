"use server";

import { createClient } from "@/utils/supabase/server";

/**********************************************************************************
 * CREATE: addAttendee
 *
 * This function accepts attendee data and creates a new attendee in the
 * database
 *
 **********************************************************************************/

export async function addAttendee(data) {
  const supabase = await createClient();

  const { error } = await supabase.from("Attendees").insert(data);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Attendee Created Successfully", error: null };
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
    .select("*")
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
