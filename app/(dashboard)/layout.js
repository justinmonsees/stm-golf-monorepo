"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import UserButton from "@/components/UserButton";
import DashboardSidebar from "@/components/DashboardSidebar";

export default async function Layout({ children }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("login");
  }

  const { data: profile, error: profile_error } = await supabase
    .from("Profiles")
    .select("user_id, first_name, last_name");

  const { data: curUser, error: curUser_error } = await supabase.rpc(
    "getcurrentuser"
  );

  return (
    <div className="flex min-h-screen w-full ">
      <div id="nav-bar" className="w-[275px] flex flex-col gap-2  border-r-2">
        <div
          id="nav-bar_header"
          className=" flex h-[75px] p-2 justify-center items-center border-b-2"
        >
          <h1>STM Golf Outing</h1>
        </div>
        <div id="nav-bar_navigation" className="flex flex-col flex-1">
          <DashboardSidebar />
        </div>
      </div>

      <div id="main" className="flex-1">
        <div id="main_header" className="h-[75px] flex p-4 border-b-2">
          <div id="main_header--userNav" className="ml-auto">
            <UserButton curUser={curUser[0]} />
          </div>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}
