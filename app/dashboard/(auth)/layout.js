"use server";

import Image from "next/image";

export default async function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full flex-row  items-center justify-center">
      <div
        id="login-form"
        className="w-1/2 p-6 bg-gray-50 h-screen flex flex-col items-center gap-4"
      >
        <div className="text-3xl uppercase text-center font-black mt-5">
          St. Thomas More <br /> Golf Outing
        </div>
        <div className="max-w-md">{children}</div>
      </div>
      <div id="login-image" className=" w-1/2 h-screen relative ">
        <Image
          src={"/golfer-sand.jpg"}
          fill
          style={{ objectFit: "cover" }}
          alt="golfer in sandtrap"
          sizes="50vw"
        />
      </div>
    </div>
  );
}
