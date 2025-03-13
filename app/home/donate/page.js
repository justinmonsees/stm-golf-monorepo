import React from "react";

import Header from "@/components/home/Header";
import PageHeader from "@/components/home/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SponsorProductCard from "@/components/home/SponsorProductCard";
import { createClient } from "@/utils/supabase/client";

export async function getSponsorItems() {
  const supabase = createClient();
  const { data: items, error } = await supabase
    .from("Items")
    .select("*")
    .eq("is_active", true)
    .eq("item_type", "sponsor");

  //get the public urls for the images
  items.map(
    (item) =>
      (item.item_image = supabase.storage
        .from("public_images/sponsorships")
        .getPublicUrl(item.item_image).data.publicUrl)
  );

  return items;
}

export const revalidate = 86400; // 24 hours in seconds (ISR)

const Donate = async () => {
  const items = await getSponsorItems();

  const sponsorItems = items
    ? items.sort((itemA, itemB) => itemA.name.localeCompare(itemB.name))
    : [];

  return (
    <>
      <Header />
      <PageHeader pageTitle={"Make a Donation"} />
      <section id="sponsorship_items" className="p-8">
        <Card className="max-w-[1200px] mx-auto">
          <CardHeader className="">
            <CardTitle className="text-2xl text-stm-red border-b-2 border-stm-red ">
              Event Sponsorships
            </CardTitle>
          </CardHeader>
          <CardContent className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <SponsorProductCard key={index} item={item} />
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default Donate;
