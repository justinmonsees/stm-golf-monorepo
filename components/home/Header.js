"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MainNav from "./MainNav";
import MobileNav from "./MobileNav";
import ShoppingCartDrawer from "./ShoppingCartDrawer";

const Header = () => {
  const links = [
    {
      title: "Past Sponsors",
      location: "/sponsors",
    },
    {
      title: "Donate",
      location: "/donate",
    },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`flex h-[75px] p-5 w-full backdrop-blur-md shadow-md ${
        hydrated ? "top-0 fixed" : ""
      } bg-opacity-80 z-[100] gap-3 ${
        isScrolled ? " bg-white" : "bg-transparent"
      }`}
    >
      <Link href="\" className="w-[60px] h-full relative">
        <Image
          src={isScrolled ? "stm_logo-red.svg" : "stm_logo-white.svg"}
          alt="Logo of dove."
          fill
          className="mr-3"
        />
      </Link>

      <MainNav isScrolled={isScrolled} links={links} />
      <MobileNav isScrolled={isScrolled} links={links} />
      <ShoppingCartDrawer isScrolled={isScrolled} />
    </div>
  );
};

export default Header;
