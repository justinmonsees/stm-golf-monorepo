"use server";

import React from "react";
import { getNonAttendeeItems } from "@/lib/actions/itemActions";
import { getSponsors } from "@/lib/actions/sponsorActions";
import { getViewingEvent } from "@/lib/actions/eventActions";
import { getDonations } from "@/lib/actions/donationActions";

import DonationsSection from "@/components/dashboard/DonationsSection";

const Donations = async () => {
  const currentEvent = await getViewingEvent();

  const [donations, items, sponsors] = await Promise.all([
    getDonations(currentEvent[0].event_id),
    getNonAttendeeItems(),
    getSponsors(),
  ]);

  return (
    <>
      <DonationsSection
        items={items}
        curEvent={currentEvent[0]}
        sponsors={sponsors}
        donations={donations}
      />
    </>
  );
};

export default Donations;
