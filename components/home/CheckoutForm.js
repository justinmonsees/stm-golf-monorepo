"use client";

import React from "react";
import SponsorCheckoutForm from "./SponsorCheckoutForm";
import AttendeeCheckoutForm from "./AttendeeCheckoutForm";
import { useCart } from "@/lib/context/cartContext";
import { useState, useEffect } from "react";
import { Spinner } from "../ui/spinner";

const CheckoutForm = () => {
  const [hydrated, setHydrated] = useState(false); // Crucial for SSR

  useEffect(() => {
    setHydrated(true); // Set hydrated to true after mount
  }, []);

  const cart = useCart();

  return (
    <div className="max-w-[1000px] my-6 mx-auto">
      {hydrated ? (
        <>
          {cart.items.find((cartItem) => cartItem.item_type === "sponsor") ? (
            <SponsorCheckoutForm />
          ) : (
            <AttendeeCheckoutForm />
          )}
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default CheckoutForm;
