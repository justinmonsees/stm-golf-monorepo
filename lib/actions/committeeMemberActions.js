"use server";

import { createClient } from "@/utils/supabase/server";

/**********************************************************************************
 * CREATE: addComitteeMember
 *
 * This function will add a committee member to the database. It will first check
 * to see if committee member exists in the inactive state. If it does, it will
 * set the is_active property to TRUE. If the committee member does not exist in
 * the database it will be created.
 *
 **********************************************************************************/

export async function addComitteeMember(data) {
  const supabase = await createClient();

  const { data: members } = await supabase
    .from("Committee_Members")
    .select("*");

  const existingMember = members.find(
    (member) => member.name.toLowerCase() === data.name.toLowerCase()
  );

  let error = null;

  if (existingMember) {
    if (existingMember.is_active === false) {
      let { error: updateError } = await supabase
        .from("Committee_Members")
        .update({ ...data, is_active: true })
        .eq("committee_member_id", existingMember.item_id);

      if (updateError) {
        error = updateError;
      }
    } else {
      error = {
        message:
          "Committee member already exists. Create a new committee member or edit the existing committee member.",
      };
    }
  } else {
    let { error: insertError } = await supabase
      .from("Committee_Members")
      .insert(data);

    if (insertError) {
      error = insertError;
    }
  }

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Committee Member Created Successfully", error: null };
  }
}

/**********************************************************************************
 * READ: getCommitteeMembers
 *
 * This function will retrieve all committee members current listed ACTIVE.
 * It will return the array of members sorted by last name and then first name.
 *
 **********************************************************************************/

export async function getCommitteeMembers() {
  const supabase = await createClient();
  const { data: members, error } = await supabase
    .from("Committee_Members")
    .select("*")
    .eq("is_active", true)
    .order("last_name", { ascending: true })
    .order("first_name", { ascending: true });

  return members;
}

/**********************************************************************************
 * UPDATE: updateCommitteeMemberByID
 *
 * This function accepts a committee member ID and the data for that a
 * committee member that needs to be updated
 *
 **********************************************************************************/

export async function updateCommitteeMemberByID(id, data) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("Committee_Members")
    .update(data)
    .eq("committee_member_id", id);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Changes Made Successfully", error: null };
  }
}

/**********************************************************************************
 * DELETE: deleteCommitteeMemberByID
 *
 * This function will set the value for is_active for the committee member to false.
 * Committee members cannot be fully deleted in the database to protect the data
 * integrity because they may still be associated with a sponsor or as chairman of a
 * a previous event. Instead the committee member can be marked as inactive.
 *
 **********************************************************************************/

export async function deleteCommitteeMemberByID(id) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("Committee_Members")
    .update({ is_active: false })
    .eq("committee_member_id", id);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Changes Made Successfully", error: null };
  }
}
