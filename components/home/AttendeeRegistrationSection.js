"use client";

import React from "react";
import AttendeeRegistrationForm from "./AttendeeRegistrationForm";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, X } from "lucide-react";
import { useCart } from "@/lib/context/cartContext";
import Link from "next/link";

const AttendeeRegistrationSection = ({ attendeeItems }) => {
  const cart = useCart();

  const [attendeeEditData, setEditAttendeeData] = useState(null);
  const [isAttendeeFormOpen, setAttendeeFormOpen] = useState(false);

  const editButtonHandler = (cartItemId) => {
    setEditAttendeeData(cartItemId);
    handleAttendeeFormOpen();
  };

  const addButtonHandler = () => {
    setEditAttendeeData(null);
    handleAttendeeFormOpen();
  };

  const handleAttendeeFormOpen = () => {
    setAttendeeFormOpen((prevVal) => !prevVal);
  };

  return (
    <div className="w-full pb-10 px-10">
      <div className=" py-10 flex justify-between">
        <span className="text-4xl font-bold">Attendees</span>

        <Button onClick={addButtonHandler}>Add Attendee</Button>
      </div>

      <AttendeeRegistrationForm
        isFormOpen={isAttendeeFormOpen}
        formHandler={handleAttendeeFormOpen}
        cartItemId={attendeeEditData}
        attendeeItems={attendeeItems}
      />

      {cart.items.find((item) => item.item_type === "attendee") ? (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-5"></TableHead>
                </TableRow>
              </TableHeader>
              {cart.items.map(
                (item) =>
                  item.item_type === "attendee" && (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.meta.firstName}</TableCell>
                      <TableCell>{item.meta.lastName}</TableCell>
                      <TableCell>{item.meta.phoneNumber}</TableCell>
                      <TableCell>{item.meta.email}</TableCell>
                      <TableCell>
                        <div className="flex gap-4">
                          <Button variant="ghost" className="p-0" asChild>
                            <Pencil
                              className="text-stm-red"
                              onClick={() => editButtonHandler(item.id)}
                            />
                          </Button>
                          <Button variant="ghost" className="p-0" asChild>
                            <X
                              className="text-stm-red"
                              onClick={() => cart.removeItem(item.id)}
                            />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
              )}
            </Table>
          </CardContent>
        </Card>
      ) : (
        <span>No attendees have been added yet.</span>
      )}

      <div className="w-full flex justify-center mt-5">
        <Button disabled={cart.items.length === 0}>
          <Link href="/checkout">Checkout</Link>
        </Button>
      </div>
    </div>
  );
};

export default AttendeeRegistrationSection;
