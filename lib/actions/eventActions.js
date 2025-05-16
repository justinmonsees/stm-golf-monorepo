"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**********************************************************************************
 * CREATE: addEvent
 *
 * This function accepts event data and creates a new event in the
 * database. It also set's the current event as the previous_event_id for
 * for the new event and sets the new event to is_current_event and is_viewing_event
 * to true.
 *
 * After creating the event, the homepage and sponsors page for the public site is
 * revalidated so that pages get regenerated with the new event information and previous
 * sponsors
 *
 **********************************************************************************/

export async function addEvent(data) {
  const supabase = await createClient();

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

/**********************************************************************************
 * READ: getEvents
 *
 * This function will get all of the events.
 *
 **********************************************************************************/

export async function getEvents() {
  const supabase = await createClient();
  const { data: events, error } = await supabase
    .from("Events")
    .select(
      "*,committee_members:Committee_Members(first_name,last_name),hosts:Hosts(name)"
    );

  return events;
}

/**********************************************************************************
 * READ: getCurrentEvent
 *
 * This function will get only the event that has the is_current_event value set
 * to true
 *
 **********************************************************************************/

export async function getCurrentEvent() {
  const supabase = await createClient();
  const { data: event, error } = await supabase
    .from("Events")
    .select("*")
    .is("is_current_event", true);

  return event;
}

/**********************************************************************************
 * READ: getViewingEvent
 *
 * This function will get only the event that has the is_viewing_event value set
 * to true
 *
 **********************************************************************************/

export async function getViewingEvent() {
  const supabase = await createClient();
  const { data: event, error } = await supabase
    .from("Events")
    .select("*")
    .is("is_viewing_event", true);
  return event;
}

/**********************************************************************************
 * UPDATE: updateEventByID
 *
 * This function accepts an event_id along with the event information to be updated
 *
 * The homepage on the public site also gets regenerated so the updated
 * information is visible on the site
 *
 **********************************************************************************/
export async function updateEventByID(id, data) {
  const supabase = await createClient();
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

/**********************************************************************************
 * UPDATE: setViewingEvent
 *
 * This is a helper function used to toggle an event as the currently viewed event
 * by first setting any events that have is_viewing_event as true to false and
 * then only setting the is_viewing_event value for the new event as true.
 *
 **********************************************************************************/

export async function setViewingEvent(newEventID) {
  const supabase = await createClient();
  //set the currently viewed event's is_viewing_event value to false
  await supabase
    .from("Events")
    .update({ is_viewing_event: false })
    .eq("is_viewing_event", true);

  updateEventByID(newEventID, { is_viewing_event: true });
}
