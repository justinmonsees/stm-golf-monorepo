import React from "react";
import Header from "@/components/home/Header";
import PageHeader from "@/components/home/PageHeader";
import AttendeeRegistrationSection from "@/components/home/AttendeeRegistrationSection";
import { createClient } from "@/utils/supabase/client";

export async function getAttendeeItems() {
  const supabase = createClient();
  const { data: items, error } = await supabase
    .from("Items")
    .select("*")
    .eq("is_active", true)
    .eq("item_type", "attendee");

  return items;
}

export const revalidate = 86400; // 24 hours in seconds (ISR)

const Register = async () => {
  const attendeeItems = await getAttendeeItems();

  return (
    <>
      <Header />
      <PageHeader pageTitle={"Register"} />
      <div id="register_form" className="p-8">
        <div className="max-w-[1200px] mx-auto">
          <AttendeeRegistrationSection attendeeItems={attendeeItems} />
        </div>
      </div>
    </>
  );
};

export default Register;
