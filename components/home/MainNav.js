import Link from "next/link";
import { Button } from "../ui/button";

const MainNav = ({ isScrolled, links }) => {
  return (
    <div
      className={` ml-auto hidden sm:flex ${
        isScrolled ? "text-stm-red" : "text-white"
      } uppercase font-semibold `}
    >
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.location}
          className=" flex px-2 py-1 items-center"
        >
          {link.title}
        </Link>
      ))}

      <Button
        asChild
        variant="outline"
        className={`${
          isScrolled ? "border-stm-red" : "border-white"
        } bg-transparent ml-2 h-full`}
      >
        <Link href="/register">Register</Link>
      </Button>
    </div>
  );
};

export default MainNav;
