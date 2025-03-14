"use server";

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { message: "Unauthorized Request" },
      { status: 401 }
    );
  }
  const supabase = createClient();
  const { data, error } = await supabase.from("Events").select("*").limit(0);

  return NextResponse.json({ revalidated: true });
}
