"use client";

import React from "react";
import { useCart } from "@/lib/context/cartContext";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ShoppingCart, X } from "lucide-react";
import CartItem from "./CartItem";

const ShoppingCartDrawer = () => {
  const cart = useCart();

  return (
    <Sheet side="right">
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <ShoppingCart color="white" />
        </Button>
      </SheetTrigger>
      <SheetContent className="z-[10000] flex flex-col">
        <SheetHeader className="flex mb-5 border-b">
          <SheetTitle className="text-center text-2xl text-stm-red">
            Your Cart
          </SheetTitle>
        </SheetHeader>
        <div
          id="sheet_body"
          className="flex-1 overflow-y-auto flex flex-col gap-4"
        >
          {cart.items.map((cartItem, index) => (
            <CartItem key={index} item={cartItem} />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex w-full">
            {" "}
            {/*display total number of times and total cost */}
            <span>
              Total{" "}
              {`(${cart.items.length} ${
                cart.items.lenght === 1 ? "Item" : "Items"
              })`}
            </span>
            <span className="ml-auto">
              $
              {`${cart.items.reduce(
                (acc, cartItem) => acc + cartItem.cost * cartItem.quantity,
                0
              )}`}
            </span>
          </div>
          <Button className="w-full inline-block">Checkout</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCartDrawer;
