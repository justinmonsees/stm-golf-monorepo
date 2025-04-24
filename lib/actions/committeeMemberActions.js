"use server";

import { createClient } from "@/utils/supabase/server";

/* This function will retrieve an array of all active committee members
 */
export async function getCommitteeMembers() {
  const supabase = createClient();
  const { data: members, error } = await supabase
    .from("Committee_Members")
    .select("*")
    .eq("is_active", true)
    .order("last_name", { ascending: true })
    .order("first_name", { ascending: true });

  return members;
}

/*This Function will add a committee member to the database. It will first check to see if committee member exists
in the inactive state. If it does, it will set the is_active property to TRUE. If the committee member does 
not exist in the database it will be created. */
export async function addComitteeMember(data) {
  const supabase = createClient();

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

export async function updateCommitteeMemberByID(id, data) {
  const supabase = createClient();
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

//This function will set the value for is_active for the item to false. Items cannot be fully deleted
// in the database to protect the data integrity. Instead the item can be deactivated. When a new item
// is created, it will first check to see if the item exists in the deactivated status before creating
// a new item in the database.
export async function deleteCommitteeMemberByID(id) {
  const supabase = createClient();
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
