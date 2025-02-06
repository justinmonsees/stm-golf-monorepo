"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Home,
  CalendarClock,
  Bell,
  Store,
  LayoutGrid,
  Users,
  Handshake,
  Gift,
  DollarSign,
  ArrowLeftToLine,
} from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

const links = [
  {
    label: "Dashboard",
    path: "/",
    icon: Home,
  },
  {
    label: "Events Info",
    path: "/events",
    icon: CalendarClock,
  },
  {
    label: "Items",
    path: "/items",
    icon: Store,
  },
  {
    label: "Expense Categories",
    path: "/expense-categories",
    icon: LayoutGrid,
  },
  {
    label: "Attendees",
    path: "/attendees",
    icon: Users,
  },
  {
    label: "Sponsors",
    path: "/sponsors",
    icon: Handshake,
  },
  {
    label: "Donations",
    path: "/donations",
    icon: Gift,
  },
  {
    label: "Expenses",
    path: "/expenses",
    icon: DollarSign,
  },
];

const DashboardSidebar = () => {
  const currentPath = usePathname();

  const [isOpen, setIsOpen] = useState(true);
  const [isPinned, setIsPinned] = useState(true);

  const togglePinned = () => setIsPinned((val) => !val);

  console.log("IS OPEN", isOpen);

  return (
    <div
      id="nav-bar"
      className={` flex flex-col gap-2  transition-all duration-250 ${
        isOpen ? "w-[275px] " : "w-[75px] "
      }`}
      onMouseEnter={() => {
        !isPinned && setIsOpen(() => true);
      }}
      onMouseLeave={() => {
        !isPinned && setIsOpen(() => false);
      }}
    >
      <div
        id="nav-bar_header"
        className=" flex h-[75px] p-2 justify-center items-center  bg-stm-red relative"
      >
        <Image src={"stm_logo.svg"} width={60} height={50} className="mr-3" />
        <h1
          className={`${isOpen ? "" : "hidden"} text-nowrap text-white text-sm`}
        >
          STM Golf Outing
        </h1>

        <Button
          variant="outline"
          size="icon"
          className="w-7 h-7 absolute start-full -translate-x-1/2"
          onClick={togglePinned}
        >
          <span className="sr-only">Collapse Sidebar</span>
          <ArrowLeftToLine
            className={`h-8 w-8 ${
              isPinned ? "" : "rotate-180"
            } transition-transform duration-750`}
          />
        </Button>
      </div>
      <div id="nav-bar_navigation" className="flex flex-col flex-1">
        <nav className="grid items-start px-2 text-sm uppercase lg:px-4 gap-2">
          {links.map((link, index) => {
            return (
              <Link
                key={index}
                href={link.path}
                className={`flex items-center gap-3 rounded-lg mr-auto w-full p-3 transition-colors duration-250 hover:bg-stm-red hover:text-white ${
                  currentPath === link.path ? "bg-stm-red text-white" : ""
                }`}
              >
                <link.icon className="h-5 w-5" />

                <span
                  className={`${isOpen ? "" : "hidden"} text-nowrap text-sm`}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default DashboardSidebar;
