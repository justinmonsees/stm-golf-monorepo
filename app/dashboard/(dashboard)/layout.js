"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import UserButton from "@/components/dashboard/UserButton";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { getViewingEvent } from "@/lib/actions/eventActions";
import { format } from "date-fns";
import { Spinner } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";

export default async function DashboardLayout({ children }) {
  const supabase = await createClient();

  const viewingEvent = await getViewingEvent();

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
    <Suspense fallback={<Spinner />}>
      <div className="flex min-h-screen w-full ">
        <DashboardSidebar />

        <div id="main" className="flex-1 bg-slate-50">
          <div
            id="main_header"
            className="h-[75px] flex justify-center px-8 pt-4 "
          >
            <div
              id="main_header--userNav"
              className="p-4 w-full h-full flex justify-between items-center bg-white rounded-md drop-shadow-md"
            >
              <h1 className="ml-10">
                {`Viewing Event Date: ${format(
                  viewingEvent[0].event_date,
                  "P"
                )} `}
              </h1>
              <UserButton className="ml-auto" curUser={curUser[0]} />
            </div>
          </div>
          <main className="h-full">
            <Card className="m-8 bg-white drop-shadow-md">{children}</Card>
          </main>
        </div>
      </div>
    </Suspense>
  );
}
