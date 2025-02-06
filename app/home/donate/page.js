import React from "react";

import Header from "@/components/home/Header";
import PageHeader from "@/components/home/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSponsorItems } from "@/lib/actions/itemActions";
import ProductCard from "@/components/home/ProductCard";

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
        <Card>
          <CardHeader className="">
            <CardTitle className="text-2xl text-stm-red border-b-2 border-stm-red ">
              Event Sponsorships
            </CardTitle>
          </CardHeader>
          <CardContent className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <ProductCard key={index} item={item} />
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default Donate;
