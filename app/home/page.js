import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import Footer from "@/components/home/Footer";
import { createClient } from "@/utils/supabase/client";

// function getFormattedDateTimeIntl() {
//   const now = new Date();
//   const formatter = new Intl.DateTimeFormat("en-US", {
//     month: "2-digit",
//     day: "2-digit",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true, // Use 12-hour format
//   });
//   return formatter.format(now);
// }

async function getCurrentEvent() {
  const supabase = createClient();
  const { data: event, error } = await supabase
    .from("Events")
    .select("*")
    .is("is_current_event", true);

  return event;
}

async function getItems() {
  const supabase = createClient();
  const { data: items, error } = await supabase
    .from("Items")
    .select("*")
    .eq("is_active", true);

  return items;
}

export const revalidate = 86400; // 24 hours in seconds (ISR)

export default async function Home() {
  const [currentEvent, items] = await Promise.all([
    getCurrentEvent(),
    getItems(),
  ]);

  const attendeeItems = items
    ? items
        .filter((item) => item.item_type === "attendee")
        .sort((itemA, itemB) => itemB.cost - itemA.cost)
    : [];

  return (
    <>
      <HeroSection eventData={currentEvent[0]} attendeeItems={attendeeItems} />
      <section className="grid grid-cols-1 sm:grid-cols-2 ">
        <div className="bg-white text-black m-auto grid px-4 py-16">
          <h2 className="uppercase text-5xl font-bold pb-5">Event Details</h2>

          <p>
            Join us for a fun day on the golf course! <br />
            Golf registration includes:
          </p>

          <ul className="list-disc list-inside my-4">
            <li>Light breakfast at registration</li>
            <li>18 holes of golf</li>
            <li>Lunch on the golf course</li>
            <li>Open bar</li>
            <li>Buffet dinner/dessert</li>
            <li>Golf raffles/prizes</li>
            <li>Golf outing giveaway</li>
          </ul>

          <Button
            asChild
            variant="outline"
            className="justify-self-center text-black border-black"
          >
            <Link href="/register">Register Now</Link>
          </Button>
        </div>
        <div
          id="image_container"
          className="hidden sm:block w-full h-auto relative"
        >
          <Image
            className=""
            src={"/golfer-sand.jpg"}
            fill
            style={{ objectFit: "cover" }}
            alt="golfer in sandtrap"
            sizes="50vw"
          />
        </div>
      </section>
      <section className="relative">
        <Image
          className="z-[-1]"
          src={"/golf_fairway.png"}
          fill
          style={{ objectFit: "cover" }}
          alt="Golf fairway"
        />
        <div className="bg-blend-overlay bg-white/80 flex text-center flex-col items-center py-16">
          <h2 className="uppercase text-5xl font-bold pb-5">Sponsors</h2>
          <p className="md:w-[50%] text-center pb-5">
            Thank you to all of our sponsors! <br /> Check out our past sponsors
            who have made this event a great success and please consider making
            a donation and sponsoring this year’s golf outing!{" "}
          </p>
          <div className="flex flex-col sm:flex-row sm:w-auto px-5 gap-4 ">
            <Button
              asChild
              variant="outline"
              className="justify-self-center text-black border-black bg-transparent"
            >
              <Link href="/sponsors">Past Sponsors</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="justify-self-center text-black border-black bg-transparent"
            >
              <Link href="/donate">Become A Sponsor</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="flex flex-col w-full bg-stm-red px-4 py-10 items-center justify-center">
        <h2 className="text-4xl text-white pb-5 text-center">
          Interested in helping on the golf commitee?
        </h2>
        <p className="md:w-[60%] text-white text-center px-10">
          This event is planned and coordinated by volunteers. We are always
          looking for new members to help with fundraising, planning, and
          facilitating on the day of the outing.
        </p>
      </section>
      <Footer />
    </>
  );
}
