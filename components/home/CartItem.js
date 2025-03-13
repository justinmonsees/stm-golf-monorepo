"use client";

import { Button } from "../ui/button";
import { useCart } from "@/lib/context/cartContext";
import Image from "next/image";
import { Minus, Plus, Trash } from "lucide-react";

const CartItem = ({ item }) => {
  const cart = useCart();

  const addToCart = () => {
    cart.addItem(item);
  };

  const removeFromCart = () => {
    cart.removeItem(item.id);
  };

  return (
    <div className="flex">
      {" "}
      {/* flexbox for the items - contains image on left - item info on right */}
      {item.item_image && (
        <div className="w-[50px] relative">
          {" "}
          {/* image container div */}
          <Image
            className="inline-block"
            src={`${item.item_image}`}
            fill
            style={{ objectFit: "contain" }}
            alt={`Product Image for ${item.name}`}
          />
        </div>
      )}
      <div className="ml-5 flex flex-col flex-1">
        {/* container for the item info */}
        <div className="flex items-center">
          <span className="text-lg font-bold"> {item.name} </span>
          {/* delete item button */}
          <Button
            variant="destructive"
            className="ml-auto p-[5px] h-7 w-7"
            onClick={removeFromCart}
          >
            <Trash />
          </Button>
        </div>
        {/* display custom info. if it's a sponsor display custom text. if it's an attendee display the name */}
        {item.item_type === "sponsor" ? (
          <span>Custom Text: {item.meta.preferredText || "default"}</span>
        ) : (
          <span>{item.meta.firstName + " " + item.meta.lastName}</span>
        )}
      </div>
    </div>
  );
};

export default CartItem;
