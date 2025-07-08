"use server";

import React from "react";
import { getAttendees } from "@/lib/actions/attendeeActions";
import TeeAssignmentSection from "@/components/dashboard/TeeAssignmentSection/TeeAssignmentSections";

import {
  generateTeeGroups,
  getGolfTeeGroups,
  getGolfTeeSettings,
} from "@/lib/actions/golfTeeGroupActions";
import { getCurrentEvent } from "@/lib/actions/eventActions";

const TeeAssignments = async () => {
  const [attendees, curEvent, golfTeeGroups, golfTeeSettings] =
    await Promise.all([
      getAttendees(),
      getCurrentEvent(),
      getGolfTeeGroups(),
      getGolfTeeSettings(),
    ]);

  //generateTeeGroups();

  return (
    <>
      <TeeAssignmentSection
        attendees={attendees}
        golfTeeGroups={golfTeeGroups}
        curEvent={curEvent[0]}
        settings={golfTeeSettings}
      />
    </>
  );
};

export default TeeAssignments;
