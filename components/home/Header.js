"use client";
import React, { useState, useEffect } from "react";

import Image from "next/image";
import MainNav from "./MainNav";
import ShoppingCartDrawer from "./ShoppingCartDrawer";
const Header = () => {
  const links = [
    {
      title: "Home",
      location: "/",
    },
    {
      title: "Sponsors",
      location: "/sponsors",
    },
  ];

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`flex p-5 w-full backdrop-blur-md shadow-md top-0 fixed bg-opacity-80 z-[100] gap-3 ${
        isScrolled ? " bg-white" : "bg-transparent"
      }`}
    >
      <Image
        src={isScrolled ? "stm_logo-red.svg" : "stm_logo-white.svg"}
        alt="Logo of dove."
        width={60}
        height={50}
        className="mr-3"
      />
      <MainNav isScrolled={isScrolled} links={links} />
      <ShoppingCartDrawer />
    </div>
  );
};

export default Header;
