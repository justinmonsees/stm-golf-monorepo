import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
});
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "STM Dashboard",
  description: "STM Golf Outing Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <div className={inter.className}>
      {children}
      <Toaster />
    </div>
  );
}
