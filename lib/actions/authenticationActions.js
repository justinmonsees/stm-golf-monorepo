"use server";

import { createClient, createAdminClient } from "@/utils/supabase/server";
import { getUserByID } from "./userActions";

/**********************************************************************************
 * login
 *
 * This function will log in a user and return the users profile if successful
 *
 **********************************************************************************/

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

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    const userProfile = await getUserByID(user.id);

    if (userProfile) {
      return { data: userProfile, error: null };
    } else {
      throw new Error("Cannot retrieve user profile.");
    }
  } catch (error) {
    return { data: null, error: error.message };
  }
}

/**********************************************************************************
 * logout
 *
 * This function will log out a user
 *
 **********************************************************************************/

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

/**********************************************************************************
 * resetUserPassword
 *
 * This function takes a user's email and initiates a password reset. Supabase
 * will then use the send_email auth hook to send the token information
 * to the reset-password-hook api route
 *
 **********************************************************************************/

export async function resetUserPassword(email) {
  const supabase = await createAdminClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Changes Made Successfully", error: null };
  }
}

/**********************************************************************************
 * updatePassword
 *
 * This function takes a user's email and the new password and update the
 * user's password in the database
 *
 **********************************************************************************/

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

/**********************************************************************************
 * verifyEmailOTP
 *
 * This function takes a user's email and OTP token that was sent to their email
 * after initiating a password reset. If the token is valid, it will refresh the
 * session so that the user can be redirected to the Reset Password form to update
 * their password.
 *
 **********************************************************************************/

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
