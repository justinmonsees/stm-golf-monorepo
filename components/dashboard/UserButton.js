"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { logout } from "@/app/dashboard/(dashboard)/actions";

import React from "react";
import Link from "next/link";

const UserButton = ({ curUser }) => {
  const initials = curUser.first_name.charAt(0) + curUser.last_name.charAt(0);

  const logoutUser = () => {
    logout();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          {initials}
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {curUser.role === "admin" ? (
          <DropdownMenuItem>
            <Link href="/users">Manage Users</Link>
          </DropdownMenuItem>
        ) : (
          ""
        )}
        <DropdownMenuItem onClick={logoutUser}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
