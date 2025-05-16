"use server";

import { createClient, createAdminClient } from "@/utils/supabase/server";
import newUserEmail from "@/utils/email-templates/new-user";
import { Resend } from "resend";
import { generateRandomPassword } from "../helpers";

/**********************************************************************************
 * CREATE: addUser
 *
 * This function accepts user data and creates a new user in the
 * database. It will then generate a random password and set the needs_reset
 * value for that user to true. The randomly generated password is then emailed
 * to the new user's email along with a link to reset their password.
 *
 **********************************************************************************/

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

/**********************************************************************************
 * READ: getUsers
 *
 * This function will get all of the users and their profiles
 *
 **********************************************************************************/

export async function getUsers() {
  const supabase = await createClient();
  const { data: users, error } = await supabase.rpc("get_all_profiles");

  return users;
}

/**********************************************************************************
 * READ: getUserByID
 *
 * This function will get a user profile given a specific user id
 *
 **********************************************************************************/

export async function getUserByID(id) {
  const supabase = await createClient();

  const { data: user, error } = await supabase
    .from("Profiles")
    .select("*")
    .eq("user_id", id)
    .single();

  return user;
}

/**********************************************************************************
 * UPDATE: updateUserByID
 *
 * This function accepts a user ID and the data for a user that
 * needs to be updated. This function allows changes to be made to the
 * auth users table in Supabase and the public schema Profiles table.
 *
 **********************************************************************************/

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

/**********************************************************************************
 * DELETE: deleteUserByID
 *
 * This function will delete a single user from the database given
 * a user_id. Profile data is deleted when a user is deleted.
 *
 **********************************************************************************/

export async function deleteUserByID(id) {
  const supabase = await createAdminClient();

  const { data, error } = supabase.auth.admin.deleteUser(id);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Changes Made Successfully", error: null };
  }
}
