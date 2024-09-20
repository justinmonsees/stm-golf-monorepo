"use server";

import { createClient } from "@/utils/supabase/server";

export async function getEvents() {
  const supabase = createClient();
  const { data: events, error } = await supabase.from("Events").select();

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

export async function updateEventByID(id, data) {
  const supabase = createClient();
  const { error } = await supabase
    .from("Events")
    .update(data)
    .eq("event_id", id);

  if (error) {
    return { result: "Error Occured", error: error };
  } else {
    return { result: "Changes Made Successfully", error: null };
  }
}
