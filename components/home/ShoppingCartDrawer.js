"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/context/cartContext";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
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
import Link from "next/link";

const ShoppingCartDrawer = ({ isScrolled }) => {
  const [hydrated, setHydrated] = useState(false); // Crucial for SSR

  useEffect(() => {
    setHydrated(true); // Set hydrated to true after mount
  }, []);

  const cart = useCart();

  return (
    <Sheet side="right">
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <ShoppingCart
            className={`${isScrolled ? "text-stm-red" : "text-white"}`}
          />
        </Button>
      </SheetTrigger>
      <SheetContent className="z-[10000] flex flex-col">
        <SheetHeader className="flex mb-5 border-b">
          <SheetTitle className="text-center text-2xl text-stm-red">
            Your Cart
          </SheetTitle>
        </SheetHeader>
        {hydrated ? (
          <>
            <div
              id="sheet_body"
              className="flex-1 overflow-y-auto flex flex-col gap-4"
            >
              {cart.items.length === 0
                ? "The cart is currently empty"
                : cart.items.map((cartItem, index) => (
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
                    cart.items.length === 1 ? "Item" : "Items"
                  })`}
                </span>
                <span className="ml-auto">
                  $
                  {`${cart.items.reduce(
                    (acc, cartItem) => acc + cartItem.cost,
                    0
                  )}`}
                </span>
              </div>
              <Button
                className="w-full inline-block"
                disabled={cart.items.length === 0}
              >
                <Link href="/checkout">Checkout</Link>
              </Button>
            </div>
          </>
        ) : (
          <Spinner />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCartDrawer;
