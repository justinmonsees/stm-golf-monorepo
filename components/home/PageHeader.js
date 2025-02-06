"use server";

import React from "react";
import Image from "next/image";

const PageHeader = ({ pageTitle }) => {
  return (
    <section>
      <div id="image_container" className="w-full h-[300px] relative">
        <Image
          src={"/golf_course_aerial.png"}
          alt="Aerial images of a golf course."
          fill
          style={{ objectFit: "cover" }}
          className="w-full z-[-1]"
        />
        <div className="h-full w-full bg-blend-overlay bg-black/50 flex text-center flex-col justify-center">
          <h1 className="uppercase text-white font-bold text-5xl">
            {pageTitle}
          </h1>
        </div>
      </div>
    </section>
  );
};

export default PageHeader;
