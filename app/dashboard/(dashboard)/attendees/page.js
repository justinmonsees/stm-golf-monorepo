"use server";

import React from "react";

import { getAttendees } from "@/lib/actions/attendeeActions";
import { getViewingEvent } from "@/lib/actions/eventActions";
import { getAttendeeItems } from "@/lib/actions/itemActions";
import { AttendeeDataProvider } from "@/lib/context/attendeesContext";
import AttendeesSection from "@/components/dashboard/AttendeesSection";

const Attendees = async () => {
  const [attendees, currentEvent, attendeeItems] = await Promise.all([
    getAttendees(),
    getViewingEvent(),
    getAttendeeItems(),
  ]);

  return (
    <AttendeeDataProvider
      attendees={attendees}
      currentEvent={currentEvent[0]}
      attendeeItems={attendeeItems}
    >
      <AttendeesSection />
    </AttendeeDataProvider>
  );
};

export default Attendees;
