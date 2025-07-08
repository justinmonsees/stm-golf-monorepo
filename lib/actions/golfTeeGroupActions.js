"use server";

import { createClient } from "@/utils/supabase/server";
import { getCurrentEvent } from "./eventActions";
import { revalidatePath } from "next/cache";

/**********************************************************************************
 * INITIALIZE generateGroups
 *
 * This function will generate the groups for each hole for the current event
 *
 **********************************************************************************/

const DEFAULT_NUM_HOLES = 18;
const DEFAULT_NUM_GROUPS = 2; // can only be 1 OR 2
const MAX_ATTENDEES_PER_GROUP = 4;
const GROUP_LETTERS = ["A", "B"];

export async function generateTeeGroups(
  numHoles = DEFAULT_NUM_HOLES,
  numGroups = DEFAULT_NUM_GROUPS
) {
  const teeGroups = [];

  const curEvent = await getCurrentEvent();

  const curEventID = curEvent[0].event_id;

  for (let holeNum = 1; holeNum <= numHoles; holeNum++) {
    for (let groupNum = 0; groupNum < numGroups; groupNum++) {
      teeGroups.push({
        event_id: curEventID,
        hole_number: holeNum,
        hole_letter: GROUP_LETTERS[groupNum],
      });
    }
  }

  const { error } = await addGolfTeeGroups(teeGroups);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Donation Created Successfully", error: null };
  }
}

/**********************************************************************************
 * CREATE: addGolfTeeGroups
 *
 * This function accepts golf tee group data and creates a new group in the
 * database. The event_id must be included in the data object.
 *
 **********************************************************************************/

export async function addGolfTeeGroups(data) {
  const supabase = await createClient();

  const { error } = await supabase.from("Golf_Tee_Groups").insert(data);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Donation Created Successfully", error: null };
  }
}

/**********************************************************************************
 * READ: getGolfTeeGroups
 *
 * This function will get all of the golf tee groups based on the event
 * that has the is_viewing_event field marked as true
 *
 **********************************************************************************/

export async function getGolfTeeGroups() {
  const supabase = await createClient();

  //first get the currently viewing event id
  const { data: curEvent } = await supabase
    .from("Events")
    .select("event_id")
    .eq("is_viewing_event", true);

  const curEventID = curEvent[0].event_id;

  const { data: golfTeeGroups, error } = await supabase
    .from("Golf_Tee_Groups")
    .select(
      "*,attendee:Attendees(attendee_id,first_name,last_name,registration_group_id)"
    )
    .eq("event_id", curEventID)
    .order("hole_number")
    .order("hole_letter");

  return golfTeeGroups;
}

/**********************************************************************************
 * UPDATE: bulkUpdateGolfTeeGroups
 *
 * This function accepts a golf tee group data array and uses Supabase upsert to
 * update multiple golf tee groups in one call.
 * **NOTE: golf_tee_group_id must be included in the object
 *
 **********************************************************************************/

export async function bulkUpdateGolfTeeGroups(data) {
  let noIdError = null;

  data.forEach((golfTeeGroupObj) => {
    if (!golfTeeGroupObj.hasOwnProperty("golf_tee_group_id")) {
      noIdError = true;
    }
  });
  if (noIdError) {
    return {
      result: "Error Occured",
      error: "One or more objects is missing a golf tee group ID",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("Golf_Tee_Groups")
    .upsert(data, { onConflict: "golf_tee_group_id", ignoreDuplicates: false });

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    revalidatePath("/tee-assignments", "page");
    return { result: "Changes Made Successfully", error: null };
  }
}

/**********************************************************************************
 * READ: getGolfTeeSettings
 *
 * This function will export all of the settings for golf tee groupings into
 * one object that gets returned
 *
 **********************************************************************************/

export async function getGolfTeeSettings() {
  return {
    numHoles: DEFAULT_NUM_HOLES,
    numGroups: DEFAULT_NUM_GROUPS,
    groupLetters: GROUP_LETTERS,
    maxGroupAttendees: MAX_ATTENDEES_PER_GROUP,
  };
}
