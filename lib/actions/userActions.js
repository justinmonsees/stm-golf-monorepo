"use server";

import { createClient, createAdminClient } from "@/utils/supabase/server";
import newUserEmail from "@/utils/email-templates/new-user";
import { Resend } from "resend";
import { generateRandomPassword } from "../helpers";

export async function getUsers() {
  const supabase = createClient();
  const { data: users, error } = await supabase.from("Profiles").select("*");

  return users;
}

export async function getUserByID(id) {
  const supabase = createClient();
  const { data: user, error } = await supabase
    .from("Profiles")
    .select("*")
    .eq("user_id", id);

  return user[0];
}

export async function addUser(newUser) {
  const supabase = createAdminClient();

  //generate a new random temporary password
  const randomPassword = generateRandomPassword();

  try {
    const { data: userData, error: userError } =
      await supabase.auth.admin.createUser({
        email: newUser.email,
        password: randomPassword,
        email_confirm: true,
        user_metadata: {
          first_name: newUser.firstName,
          last_name: newUser.lastName,
          role: newUser.role,
          needs_reset: true,
        },
      });

    if (userError) {
      throw new Error(userError.message);
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: `STM Golf Event <${process.env.SEND_FROM_EMAIL}>`,
      to: [newUser.email],
      subject: "STM Golf App: New User Created",
      react: newUserEmail({ newPassword: randomPassword }),
    });

    if (emailError) {
      console.log(emailError.message);
      throw new Error(emailError.message);
    }

    return { result: "Changes Made Successfully", error: null };
  } catch (error) {
    return { result: "Error Occured", error: error.message };
  }
}

export async function resetUserPassword(email) {
  const supabase = createAdminClient();
  console.log("EMAIL", email);
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:3000/reset",
  });

  if (error) {
    console.log("PASSWORD RESET ERROR", error);
    console.log("PASSWORD RESET DATA: ", data);

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

  const { data: updateResult, error } = await supabase
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
