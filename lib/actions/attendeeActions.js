"use server";

import { createClient } from "@/utils/supabase/server";

/*This Function will add an attendee to the database. */
export async function addAttendee(data) {
  const supabase = await createClient();

  const { error } = await supabase.from("Attendees").insert(data);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Attendee Created Successfully", error: null };
  }
}

export async function getAttendees() {
  const supabase = await createClient();

  //first get the current event id
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

//This function will delete an attendee from the database

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
