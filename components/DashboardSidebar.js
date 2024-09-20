"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

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

  return (
    <nav className="grid items-start px-2 text-lg font-medium lg:px-4 gap-2">
      {links.map((link, index) => {
        return (
          <Link
            key={index}
            href={link.path}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-stm-red hover:text-white ${
              currentPath === link.path ? "bg-stm-red text-white" : ""
            }`}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default DashboardSidebar;
