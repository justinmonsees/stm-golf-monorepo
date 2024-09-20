"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(email, password) {
  const supabase = createClient();

  const formInfo = {
    email: email,
    password: password,
  };

  const { data, error } = await supabase.auth.signInWithPassword(formInfo);
  console.log(data);
  if (error) {
    console.log(error);
    redirect("/login");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
