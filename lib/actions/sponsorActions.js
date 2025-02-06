"use server";

import { createClient } from "@/utils/supabase/server";

export async function getSponsors() {
  const supabase = createClient();
  const { data: sponsors, error } = await supabase
    .from("Sponsors")
    .select("*,committee_members:Committee_Members(first_name,last_name)")
    .eq("is_active", true);

  return sponsors;
}

export async function getPastSponsors() {
  const supabase = createClient();
  const { data: sponsors, error } = await supabase.rpc("get_past_donors");
  //once we have the data, group the sponsors by donation type and sort the group by the
  // cost of the donation with the highest amount being first

  //first check in the result array if a javascript object for the current donation type value exists

  // if it does do nothing, if it does not add a javascript object to the result array with
  //      the current donation name
  const sponsorsByDonationType = sponsors.reduce((result, currentValue) => {
    result.find((value) => value["name"] === currentValue["name"]) ||
      result.push({
        name: currentValue["name"],
        cost: currentValue["cost"],
        sponsors: [],
      });

    //add the current sponsor to the corresponding javascript object within the result array
    result
      .find((value) => value["name"] === currentValue["name"])
      .sponsors.push(currentValue["company_name"]);

    return result;
  }, []);

  //Sort the array of objects by donation cost from greatest to least
  sponsorsByDonationType.sort((a, b) => b.cost - a.cost);

  return sponsorsByDonationType;
}

export async function getSponsorsByCommitteeMember() {
  const supabase = createClient();
  const { data: sponsors, error } = await supabase
    .from("Sponsors")
    .select("*,committee_members:Committee_Members(first_name,last_name)")
    .eq("is_active", true);

  return sponsors;
}

/*This Function will add a Sponsor to the database. It will first check to see if Sponsor exists
in the inactive state. If it does, it will set the is_active property to TRUE. If the Sponsor does 
not exist in the database it will be created. */
export async function addSponsor(data) {
  const supabase = createClient();

  const { data: sponsors } = await supabase.from("Sponsors").select("*");

  const existingSponsor = sponsors.find(
    (sponsor) =>
      sponsor.company_name.toLowerCase() === data.company_name.toLowerCase()
  );

  let error = null;

  if (existingSponsor) {
    if (existingSponsor.is_active === false) {
      let { error } = await supabase
        .from("Sponsors")
        .update({ ...data, is_active: true })
        .eq("sponsor_id", existingSponsor.sponsor_id);
    } else {
      console.log("Sponsor exists already.");
      error =
        "Sponsor already exists. Create a new sponsor or edit the existing sponsor.";
    }
  } else {
    let { error } = await supabase.from("Sponsors").insert(data);
  }

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Sponsor Created Successfully", error: null };
  }
}

export async function updateSponsorByID(id, data) {
  const supabase = createClient();
  const { error } = await supabase
    .from("Sponsors")
    .update(data)
    .eq("sponsor_id", id);

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
export async function deleteSponsorByID(id) {
  const supabase = createClient();
  const { error } = await supabase
    .from("Sponsors")
    .update({ is_active: false })
    .eq("sponsor_id", id);

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Changes Made Successfully", error: null };
  }
}
