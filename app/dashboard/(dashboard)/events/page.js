"use server";

import React from "react";

import { getEvents } from "../../../../lib/actions/eventActions";
import { getCommitteeMembers } from "@/lib/actions/committeeMemberActions";
import { getHosts } from "@/lib/actions/hostActions";
import EventsSection from "@/components/dashboard/EventSection";

const Events = async () => {
  const [events, committeeMembers, hosts] = await Promise.all([
    getEvents(),
    getCommitteeMembers(),
    getHosts(),
  ]);

  return (
    <>
      <EventsSection
        events={events}
        committeeMembers={committeeMembers}
        hosts={hosts}
      />
    </>
  );
};

export default Events;
