"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { useCart } from "@/lib/context/cartContext";
import Image from "next/image";
import { Minus, Plus, Trash, Settings2 } from "lucide-react";

const ProductCard = ({ item }) => {
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

  return (
    <Card className="w-full rounded-xl overflow-hidden">
      <CardHeader className="bg-stm-red ">
        <CardTitle className="uppercase text-white text-base text-center">
          {item.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 pb-0">
        <div id="image_container" className="w-full h-[150px] relative ">
          <Image
            className="inline-block"
            src={`${item.item_image}`}
            fill
            style={{ objectFit: "contain" }}
            alt={`Product Image for ${item.name}`}
          />
        </div>
        <h1 className="text-center text-lg py-2">${item.cost}</h1>
      </CardContent>
      <CardFooter className="justify-center">
        {cart.items.findIndex((cartItem) => cartItem.item_id === item.item_id) >
        -1 ? (
          <div className="flex w-full">
            {/* main div for the buttons */}

            {/*flexbox div the quantity selector */}
            <div id={`${item.name}-qtySelector`} className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={reduceItemQtyFromCart}
              >
                <Minus />
              </Button>
              <div className="h-10 w-10 border-[1px] border-gray-500 p-1 flex justify-center mx-2">
                <span className="self-center">
                  {
                    cart.items.find(
                      (cartItem) => cartItem.item_id === item.item_id
                    ).quantity
                  }
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={addToCart}>
                <Plus />
              </Button>
            </div>

            {/* delete item button */}
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={removeFromCart}
            >
              <Trash />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="border-stm-red text-stm-red w-full"
            onClick={addToCart}
          >
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
