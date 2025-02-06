"use server";

import React from "react";
import { getItems } from "@/lib/actions/itemActions";
import ItemsSection from "@/components/dashboard/ItemsSection";
const Items = async () => {
  const items = await getItems();

  return (
    <>
      <ItemsSection items={items} />
    </>
  );
};

export default Items;
