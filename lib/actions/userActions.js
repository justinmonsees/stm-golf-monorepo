"use server";

import { createClient, createAdminClient } from "@/utils/supabase/server";
import newUserEmail from "@/utils/email-templates/new-user";
import { Resend } from "resend";
import { generateRandomPassword } from "../helpers";

export async function getUsers() {
  const supabase = createClient();
  const { data: users, error } = await supabase.rpc("get_all_profiles");

  return users;
}

export async function getUserByID(id) {
  const supabase = createClient();

  const { data: allUsers, error } = await supabase.rpc("get_all_profiles");

  const user = allUsers?.find((user) => user.id === id);

  return user;
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
          first_name: newUser.first_name,
          last_name: newUser.last_name,
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

    if (emailError && Object.keys(emailError).length >= 1) {
      throw new Error(emailError.message);
    }

    return { result: "Changes Made Successfully", error: null };
  } catch (error) {
    return { result: "Error Occured", error: error.message };
  }
}

export async function resetUserPassword(email) {
  const supabase = createAdminClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    console.log("ERROR", error);
    return { result: "Error Occured", error: error.message };
  } else {
    console.log("SUCCESS");
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
  const supabaseAdmin = createAdminClient();

  const profileUpdateData = {
    first_name: data.first_name,
    last_name: data.last_name,
    role: data.role,
  };

  const userUpdateData = {
    email: data.email,
  };

  const [userUpdateResult, profileUpdateResult] = await Promise.all([
    supabaseAdmin.auth.admin.updateUserById(id, userUpdateData),
    supabase.from("Profiles").update(profileUpdateData).eq("user_id", id),
  ]);

  if (userUpdateResult.error) {
    return {
      result: "User Error Occured",
      error: userUpdateResult.error.message,
    };
  } else if (profileUpdateResult.error) {
    return {
      result: "Profile Error Occured",
      error: profileUpdateResult.error.message,
    };
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
