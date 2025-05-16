"use server";

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**************************************************************************
 *
 * This GET API Endpoint is used to keep the Supabase database active
 * by calling the supabase database with a dummy get request.
 *
 * Supabase hobby plan will pause the project if not in use for 2 weeks
 *
 * A cron job within Vercel project settings has been created to call this
 * endpoint every week to keep the project active.
 *
 * This does use a CRON_SECRET variable to secure this endpoint
 *
 **************************************************************************/

export async function GET(request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { message: "Unauthorized Request" },
      { status: 401 }
    );
  }

  //make a dummy supabase call that doesn't return any results but still makes a
  //request to supabase to keep it active
  const supabase = createClient();
  const { data, error } = await supabase.from("Events").select("*").limit(0);

  return NextResponse.json({ revalidated: true });
}
