"use server";

import { ResetPasswordForm } from "@/components/ResetPasswordForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Reset() {
  const supabase = createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user) {
    redirect("/error");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ResetPasswordForm user={user} />
    </main>
  );
}
