"use server";

import { createClient, createAdminClient } from "@/utils/supabase/server";
import newUserEmail from "@/utils/email-templates/new-user";
import { Resend } from "resend";
import { generateRandomPassword } from "../helpers";

export async function getUsers() {
  const supabase = await createClient();
  const { data: users, error } = await supabase.rpc("get_all_profiles");

  return users;
}

export async function getUserByID(id) {
  const supabase = await createClient();

  const { data: user, error } = await supabase
    .from("Profiles")
    .select("*")
    .eq("user_id", id)
    .single();

  return user;
}

export async function addUser(newUser) {
  const supabase = await createAdminClient();

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
  const supabase = await createAdminClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Changes Made Successfully", error: null };
  }
}

export async function updatePassword(email, newPassword) {
  const supabase = await createClient();

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
  const supabase = await createClient();
  const supabaseAdmin = await createAdminClient();

  let userUpdateResult = null,
    profileUpdateResult = null;

  if (data.hasOwnProperty("email")) {
    //update the email in the supabase.auth table and the profile data in the Profiles table
    const { ["email"]: userUpdateData, ...profileUpdateData } = data;

    [userUpdateResult, profileUpdateResult] = await Promise.all([
      supabaseAdmin.auth.admin.updateUserById(id, { email: userUpdateData }),
      supabase.from("Profiles").update(profileUpdateData).eq("user_id", id),
    ]);
  } else {
    //only need to update the profile data in the Profiles table
    profileUpdateResult = await supabase
      .from("Profiles")
      .update(data)
      .eq("user_id", id);
  }

  if (userUpdateResult?.error) {
    return {
      result: "User Error Occured",
      error: userUpdateResult.error.message,
    };
  } else if (profileUpdateResult?.error) {
    return {
      result: "Profile Error Occured",
      error: profileUpdateResult.error.message,
    };
  } else {
    return { result: "Changes Made Successfully", error: null };
  }
}

export async function deleteUserByID(id) {
  const supabase = await createAdminClient();

  const { data, error } = supabase.auth.admin.deleteUser(id);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Changes Made Successfully", error: null };
  }
}

export async function verifyEmailOTP(email, otp) {
  try {
    const supabase = await createClient();

    const {
      data: { session },
      verifyError,
    } = await supabase.auth.verifyOtp({
      email: email,
      token: otp,
      type: "email",
    });
    if (!session) {
      throw new Error("Invalid Verification Code");
    }
    //first refresh the session
    const {
      data: { newSession },
      error: sessionError,
    } = await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    if (verifyError) {
      throw new Error(verifyError.code);
    } else if (sessionError) {
      throw new Error(sessionError.code);
    }
  } catch (error) {
    return { result: "Error Occured", error: error.message };
  }

  return { result: "Changes Made Successfully", error: null };
}
