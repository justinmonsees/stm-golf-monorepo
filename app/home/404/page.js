import Footer from "@/components/home/Footer";
import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
export default function homeNotFound() {
  return (
    <>
      <section className="relative h-screen">
        <Image
          src={"/golf-ball-rough.png"}
          alt="Image of a golf ball in tall grass."
          fill={true}
          style={{ objectFit: "cover" }}
          className="w-full z-[-1]"
        />
        <div className="flex flex-col h-full items-center ">
          <div className="text-white mt-[100px] text-center px-5">
            <h1 className="text-xl font-bold">404: Page Not Found</h1>
            <h3 className="text-xl sm:text-2xl ">
              Looks like you landed in the rough.
            </h3>
            <p>Use the navigation links above to get back on the fairway.</p>
          </div>
          <div className="mt-auto w-full">
            <Footer />
          </div>
        </div>
      </section>
    </>
  );
}
