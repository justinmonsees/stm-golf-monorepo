"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/";

  console.log("TOKEN HASH", token_hash);
  console.log("TYPE:", type);
  console.log("NEXT", next);

  if (token_hash && type) {
    const supabase = await createClient();

    const {
      data: { user, session },
      error,
    } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    console.log("SESSION", session);

    //first refresh the session
    const {
      data: { newSession },
      error: sessionError,
    } = await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    if (!error) {
      // redirect user to specified redirect URL or root of app
      redirect(next);
    }
  }

  // redirect the user to an error page with some instructions
  //console.log(error.message);

  redirect("/error");
}
