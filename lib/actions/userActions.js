"use server";

import { createClient, createAdminClient } from "@/utils/supabase/server";

export async function getUsers() {
  const supabase = createClient();
  const { data: users, error } = await supabase.from("Profiles").select("*");

  return users;
}

export async function addUser(newUser) {
  const supabase = createAdminClient();

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(
    newUser.email,
    {
      data: {
        first_name: newUser.firstName,
        last_name: newUser.lastName,
        role: newUser.role,
      },
    }
  );

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Changes Made Successfully", error: null };
  }
}

export async function updatePassword(email, newPassword) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.updateUser({
    email: email,
    password: newPassword,
  });

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Changes Made Successfully", error: null };
  }
}

export async function updateUserByID(id, data) {
  const supabase = createClient();

  const { error } = await supabase
    .from("Profiles")
    .update(data)
    .eq("user_id", id);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Changes Made Successfully", error: null };
  }
}

export async function deleteUserByID(id) {
  const supabase = createAdminClient();

  const { data, error } = supabase.auth.admin.deleteUser(id);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Changes Made Successfully", error: null };
  }
}
