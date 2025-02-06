"use server";

import React from "react";

import Header from "@/components/home/Header";
import PageHeader from "@/components/home/PageHeader";
import CheckoutForm from "@/components/home/CheckoutForm";
const Checkout = () => {
  return (
    <>
      <Header />
      <PageHeader pageTitle={"Checkout"} />
      <CheckoutForm />
    </>
  );
};

export default Checkout;
