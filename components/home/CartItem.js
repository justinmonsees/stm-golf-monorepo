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

  const reduceItemQtyFromCart = () => {
    cart.reduceItemQty(item.item_id);
  };

  const removeFromCart = () => {
    cart.removeItem(item.item_id);
  };
  console.log(cart);

  return (
    <div className="flex">
      {" "}
      {/* flexbox for the items - contains image on left - item info on right */}
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

        <div className="flex">
          <div className="flex w-full">
            {/* main div for the buttons */}

            {/*flexbox div the quantity selector */}
            <div id={`${item.name}-qtySelector`} className="flex items-center">
              <Button
                variant="ghost"
                className="p-[5px] h-7 w-7"
                onClick={reduceItemQtyFromCart}
              >
                <Minus />
              </Button>
              <div className="h-7 w-7 border-[1px] border-gray-500 p-1 flex justify-center mx-2">
                <span className="self-center">
                  {
                    cart.items.find(
                      (cartItem) => cartItem.item_id === item.item_id
                    ).quantity
                  }
                </span>
              </div>
              <Button
                variant="ghost"
                className="p-[5px] h-7 w-7"
                onClick={addToCart}
              >
                <Plus />
              </Button>
            </div>
          </div>
          <h1 className="text-center text-lg py-2">
            ${item.cost * item.quantity}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
