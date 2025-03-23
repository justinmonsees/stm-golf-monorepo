"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { useCart } from "@/lib/context/cartContext";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { X } from "lucide-react";

export const schema = z.object({
  preferredText: z.string().nullable(),
});

const SponsorProductCard = ({ item }) => {
  const cart = useCart();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      preferredText: "",
    },
  });

  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlipClick = () => {
    setIsFlipped(!isFlipped);
  };

  const onSubmit = async (data) => {
    cart.addItem({ ...item, meta: data });

    form.reset();
    handleFlipClick();
  };

  return (
    <div className="flipCard_container relative h-[350px]">
      <div
        className={` flipCard_card absolute w-full h-full transition-transform duration-500 preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        <Card className="flipCard_front absolute w-full h-full rounded-xl overflow-hidden backface-hidden">
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
            <Button
              variant="outline"
              className="border-stm-red text-stm-red w-full grow"
              onClick={handleFlipClick}
            >
              Customize
            </Button>
          </CardFooter>
        </Card>

        <Card className="flipCard_front absolute w-full h-full rounded-xl backface-hidden rotate-y-180 ">
          <Button
            asChild
            className="absolute top-3 right-3 h-6 w-6 p-0"
            variant="ghost"
            onClick={handleFlipClick}
          >
            <X className="text-stm-red" />
          </Button>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="h-full flex flex-col"
            >
              <CardHeader>
                <CardTitle className="text-lg">
                  {`Customize Your Sponsorship\nSignage Text`}
                </CardTitle>
                <p className="text-xs">
                  {`If nothing is entered, we'll use your company name by
                  default.`}
                </p>
              </CardHeader>
              <CardContent className="flex-1">
                <FormField
                  control={form.control}
                  name="preferredText"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Enter custom text here..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit">
                  Add To Cart
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default SponsorProductCard;
