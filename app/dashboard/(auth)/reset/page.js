"use server";

import { ResetPasswordForm } from "@/components/dashboard/ResetPasswordForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserByID } from "@/lib/actions/userActions";

export default async function Reset() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userProfile = await getUserByID(user.id);

  const isDefaultPassword = userProfile.needs_reset;

  return (
    <>
      <ResetPasswordForm user={user} initReset={isDefaultPassword} />
    </>
  );
}
