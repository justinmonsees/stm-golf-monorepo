"use server";

import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { Calendar, DollarSign, Clock, MapPinned } from "lucide-react";
import InfoCard from "./InfoCard";
import { convertToLocalDate } from "@/lib/helpers";

const HeroSection = ({ eventData, attendeeItems }) => {
  const eventDate = convertToLocalDate(eventData.event_date).toLocaleDateString(
    "en-us",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <>
      <section className="h-full relative">
        <Image
          src={"/hero-bg.png"}
          alt="Background image of hero section depicting a golf course."
          fill={true}
          style={{ objectFit: "cover" }}
          className="w-full z-[-1]"
        />

        <div className="sm:min-h-screen w-full bg-blend-overlay bg-black/50 flex text-center flex-col justify-center">
          <div className="text-white relative mt-[150px]">
            <p className="font-lobster text-2xl sm:text-3xl">18th Annual</p>
            <p className="font-noto sm:text-4xl font-light sm:leading-10 text-xl leading-tight">
              St. Thomas More <br /> Francis S. Midura <br />
              Golf Outing
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-2 px-10">
            <Button
              asChild
              variant="outline"
              className="text-white border-white bg-transparent "
            >
              <Link href="/register">Register Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="text-white border-white bg-trans"
            >
              <Link href="/donate">Become a Sponsor</Link>
            </Button>
          </div>

          <div className="mt-auto grid lg:grid-cols-4 sm:grid-cols-2 w-full gap-y-3 gap-x-3 py-3 px-8">
            <InfoCard
              infoIcon={<Calendar />}
              infoTitle={"Date"}
              infoText={eventDate}
            ></InfoCard>

            <InfoCard
              infoIcon={<Clock />}
              infoTitle={"Time"}
              infoText={`Registration: ${eventData.arrival_time}\nShotgun Start: ${eventData.start_time}`}
            ></InfoCard>

            <InfoCard
              infoIcon={<DollarSign />}
              infoTitle={"Cost"}
              infoText={attendeeItems
                .map((item) => `$${item.cost} Per ${item.name}`)
                .join(`\n`)}
            ></InfoCard>

            <InfoCard
              infoIcon={<MapPinned />}
              infoTitle={"Location"}
              infoText={`${eventData.venue_name}\n${eventData.venue_address}${
                eventData.venue_address2 ? eventData.venue_address2 : ""
              }\n${eventData.venue_city}, ${eventData.venue_state} ${
                eventData.venue_zip
              }`}
            ></InfoCard>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
