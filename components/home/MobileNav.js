import Link from "next/link";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMemo, useState } from "react";

const MobileNav = ({ isScrolled, links }) => {
  const [open, setOpen] = useState(false);

  const handleLinkClick = () => {
    setOpen(false); // Explicitly close the Sheet
  };

  const mobileLinks = useMemo(
    () => [
      {
        title: "Home",
        location: "/",
      },
      ...links,
    ],
    [links]
  );

  return (
    <div
      className={`flex ml-auto sm:hidden ${
        isScrolled ? "text-stm-red" : "text-white"
      } uppercase font-semibold `}
    >
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className=" bg-transparent">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side={"top"} className="z-[150] h-screen px-20">
          <SheetHeader className="text-left">
            <SheetTitle>STM Golf Outing</SheetTitle>
            <SheetDescription className="sr-only">
              Dialog box overlay with mobile links for the website
            </SheetDescription>
          </SheetHeader>
          <div
            id="mobile-nav-body"
            className="flex flex-col gap-5  justify-center h-full"
          >
            {mobileLinks.map((link, index) => (
              <Link
                key={index}
                href={link.location}
                onClick={handleLinkClick}
                className=" flex px-2 py-1 items-center uppercase text-4xl font-black tracking-wide"
              >
                {link.title}
              </Link>
            ))}

            <Button
              asChild
              className="bg-stm-red text-white uppercase text-2xl h-auto w-full mt-20"
            >
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
