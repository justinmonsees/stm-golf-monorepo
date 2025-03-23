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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
      <div className=" py-10 flex flex-col gap-4 sm:flex-row justify-between">
        <span className="text-4xl font-bold">Attendees</span>

        <Button onClick={addButtonHandler}>Add Attendee</Button>
      </div>
      <AttendeeRegistrationForm
        isFormOpen={isAttendeeFormOpen}
        formHandler={handleAttendeeFormOpen}
        cartItemId={attendeeEditData}
        attendeeItems={attendeeItems}
      />

      {/*************************************************************************************
       *
       * This is the section for the non-mobile version of the website that will display
       * the golfers to be registered in a table
       *
       **************************************************************************************/}

      {cart.items.find((item) => item.item_type === "attendee") ? (
        <>
          <Card className="hidden sm:flex ">
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
          {/*************************************************************************************
           * This is the section for the mobile version of the website that will display
           * the golfers to be registered in an accordian *
           **************************************************************************************/}
          <Accordion type="single" collapsible className="sm:hidden">
            {cart.items.map(
              (item) =>
                item.item_type === "attendee" && (
                  <AccordionItem key={item.id} value={item.id}>
                    <AccordionTrigger>{`${item.meta.firstName} ${item.meta.lastName}`}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="mb-2">
                        <li>{`Guest Type: ${item.name}`}</li>
                        <li>{`Phone Number: ${item.meta.phoneNumber}`}</li>
                        <li>{`Email: ${item.meta.email}`}</li>
                      </ul>
                      <div className="flex flex-col gap-4">
                        <Button
                          variant="outline"
                          className="p-0 gap-2 text-stm-red border-stm-red hover:text-white hover:bg-stm-red"
                          onClick={() => editButtonHandler(item.id)}
                        >
                          <span>Edit</span>
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          className="p-0 gap-2 text-stm-red border-stm-red hover:text-white hover:bg-stm-red"
                          onClick={() => cart.removeItem(item.id)}
                        >
                          <span>Delete</span>
                          <X />
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
            )}
          </Accordion>
        </>
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
