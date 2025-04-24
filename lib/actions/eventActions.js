"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/*This Function will add an event to the database. */
export async function addEvent(data) {
  const supabase = createClient();

  const curEvent = await getCurrentEvent();
  //store the current event id to be used as the past event id for the new event
  const prevEventID = curEvent[0].event_id;

  //set the current event's is_current_event value to false
  await supabase
    .from("Events")
    .update({ is_current_event: false })
    .eq("is_current_event", true);

  //set the currently viewed event's is_viewing_event value to false
  await supabase
    .from("Events")
    .update({ is_viewing_event: false })
    .eq("is_viewing_event", true);

  //set the new event's is_current_event value to true
  data.is_current_event = true;
  //set the previous event id of the new event to the event that was the current event
  data.prev_event_id = prevEventID;
  //set the new event's is_viewing_event value to true
  data.is_viewing_event = true;

  const { error } = await supabase.from("Events").insert(data);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    revalidatePath("/home", "page");
    revalidatePath("/sponsors", "page");
    return { result: "Event Created Successfully", error: null };
  }
}

export async function getEvents() {
  const supabase = createClient();
  const { data: events, error } = await supabase
    .from("Events")
    .select(
      "*,committee_members:Committee_Members(first_name,last_name),hosts:Hosts(name)"
    );

  return events;
}

export async function getCurrentEvent() {
  const supabase = createClient();
  const { data: event, error } = await supabase
    .from("Events")
    .select("*")
    .is("is_current_event", true);

  return event;
}

export async function getViewingEvent() {
  const supabase = createClient();
  const { data: event, error } = await supabase
    .from("Events")
    .select("*")
    .is("is_viewing_event", true);
  return event;
}

export async function updateEventByID(id, data) {
  const supabase = createClient();
  const { error } = await supabase
    .from("Events")
    .update(data)
    .eq("event_id", id);

  if (error) {
    return { result: "Error Occured", error: error };
  } else {
    revalidatePath("/home", "page");
    return { result: "Changes Made Successfully", error: null };
  }
}

export async function setViewingEvent(newEventID) {
  const supabase = createClient();
  //set the currently viewed event's is_viewing_event value to false
  await supabase
    .from("Events")
    .update({ is_viewing_event: false })
    .eq("is_viewing_event", true);

  updateEventByID(newEventID, { is_viewing_event: true });
}
