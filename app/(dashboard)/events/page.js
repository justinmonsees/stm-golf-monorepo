"use server";

import React from "react";

import { getEvents } from "../../../lib/actions/eventActions";
import EventSection from "@/components/EventSection";

const Events = async () => {
  const events = await getEvents();

  return (
    <>
      <EventSection events={events} />
    </>
  );
};

export default Events;
