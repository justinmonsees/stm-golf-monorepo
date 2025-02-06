"use server";

import React from "react";

import { getAttendees } from "@/lib/actions/attendeeActions";
import { getViewingEvent } from "@/lib/actions/eventActions";
import AttendeesSection from "@/components/dashboard/AttendeesSection";

const Attendees = async () => {
  const [attendees, currentEvent] = await Promise.all([
    getAttendees(),
    getViewingEvent(),
  ]);

  return (
    <>
      <AttendeesSection attendees={attendees} curEvent={currentEvent[0]} />
    </>
  );
};

export default Attendees;
