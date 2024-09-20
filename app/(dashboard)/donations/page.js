"use server";

import React from "react";
import { getItems } from "@/lib/actions/itemActions";
import { getSponsors } from "@/lib/actions/sponsorActions";
import { getCurrentEvent } from "@/lib/actions/eventActions";
import { getDonations } from "@/lib/actions/donationActions";

import DonationsSection from "@/components/DonationsSection";

const Donations = async () => {
  const currentEvent = await getCurrentEvent();

  const [donations, items, sponsors] = await Promise.all([
    getDonations(currentEvent[0].event_id),
    getItems(),
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
