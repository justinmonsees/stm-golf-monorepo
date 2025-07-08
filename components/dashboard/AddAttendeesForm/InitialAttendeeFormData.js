"use server";

import { getAttendeeItems } from "@/lib/actions/itemActions";
import { getCurrentEvent } from "@/lib/actions/eventActions";

export const fetchInitialAttendeeFormData = async () => {
  const [attendeeItems, currentEvent] = await Promise.all([
    getAttendeeItems(),
    getCurrentEvent(),
  ]);

  const currentEventID = currentEvent[0].event_id;
  return { attendeeItems, currentEventID };
};
