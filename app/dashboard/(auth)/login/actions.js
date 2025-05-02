"use server";

import { getUserByID } from "@/lib/actions/userActions";

import { createClient } from "@/utils/supabase/server";

export async function login(email, password) {
  const supabase = await createClient();

  const formInfo = {
    email: email,
    password: password,
  };

  try {
    const { data, error } = await supabase.auth.signInWithPassword(formInfo);

    if (error) {
      throw new Error(error.message);
    }

    const { data: userObj, error: userError } = await supabase.auth.getUser();

    const userProfile = await getUserByID(userObj.user.id);

    if (userProfile) {
      return { data: userProfile, error: null };
    } else {
      throw new Error("Cannot retrieve user profile.");
    }
  } catch (error) {
    return { data: null, error: error.message };
  }
}
