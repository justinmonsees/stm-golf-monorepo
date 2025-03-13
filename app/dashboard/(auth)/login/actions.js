"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getUserByID } from "@/lib/actions/userActions";

import { createClient } from "@/utils/supabase/server";

export async function login(email, password) {
  const supabase = createClient();

  const formInfo = {
    email: email,
    password: password,
  };

  try {
    const { data, error } = await supabase.auth.signInWithPassword(formInfo);
    console.log("LOGIN MESSAGE: ", error);

    if (error) {
      throw new Error(error.message);
    }

    const userProfile = await getUserByID(data.user.id);

    if (userProfile) {
      return { data: userProfile, error: null };
    } else {
      throw new Error("Cannot retrieve user profile.");
    }
  } catch (error) {
    return { data: null, error: error.message };
  }
}
