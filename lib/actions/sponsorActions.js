"use server";

import { createClient } from "@/utils/supabase/server";

/**********************************************************************************
 * CREATE: addSponsor
 *
 * This Function will add a Sponsor to the database. It will first check to see
 * if the sponsor exists in the inactive state. If it does, it will set the
 * is_active property to TRUE. If the sponsor does not exist in the database
 * it will be created.
 *
 **********************************************************************************/

export async function addSponsor(data) {
  const supabase = await createClient();

  const { data: sponsors } = await supabase.from("Sponsors").select("*");

  const existingSponsor = sponsors.find(
    (sponsor) =>
      sponsor.company_name.toLowerCase() === data.company_name.toLowerCase()
  );

  let error = null;

  if (existingSponsor) {
    if (existingSponsor.is_active === false) {
      let { error: updateError } = await supabase
        .from("Sponsors")
        .update({ ...data, is_active: true })
        .eq("sponsor_id", existingSponsor.sponsor_id);

      if (updateError) {
        error = updateError;
      }
    } else {
      error = {
        message:
          "Sponsor already exists. Create a new sponsor or edit the existing sponsor.",
      };
    }
  } else {
    let { data: sponsorData, error: insertError } = await supabase
      .from("Sponsors")
      .insert(data);

    if (insertError) {
      error = insertError;
    }
  }

  if (error) {
    return { result: "Error Occured", error: error.message };
  } else {
    return { result: "Sponsor Created Successfully", error: null };
  }
}

/**********************************************************************************
 * READ: getSponsors
 *
 * This function will get all of the sponsors that are currently active and return
 * them as sorted by company name
 *
 **********************************************************************************/

export async function getSponsors() {
  const supabase = await createClient();

  const { data: sponsors, error } = await supabase
    .from("Sponsors")
    .select("*,committee_members:Committee_Members(first_name,last_name)")
    .eq("is_active", true)
    .order("company_name", { ascending: true });

  return sponsors;
}

/**********************************************************************************
 * READ: getPastSponsors
 *
 * This function will get all of the past sponsors and sort the sponsors by donation
 * type. After each donation type has a group of sponsors, those donation types
 * are sorted in order from most expensive to least expense
 *
 * If this is the is the first event meaning there are no previous sponsors,
 * this function will return an empty array.
 *
 **********************************************************************************/

export async function getPastSponsors() {
  const supabase = await createClient();

  const { data: sponsors, error } = await supabase.rpc("get_past_donors");

  //once we have the data, group the sponsors by donation type and sort the group by the
  // cost of the donation with the highest amount being first

  const sponsorsByDonationType = sponsors.reduce((result, currentValue) => {
    //first check in the result array if a javascript object for the current donation type value exists

    result.find((value) => value["name"] === currentValue["name"]) ||
      // if it does do nothing, if it does not add a javascript object to the result array with
      //the current donation name
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

/**********************************************************************************
 * UPDATE: updateSponsorByID
 *
 * This function accepts a sponsor ID and the data for a sponsor that
 * needs to be updated
 *
 **********************************************************************************/

export async function updateSponsorByID(id, data) {
  const supabase = await createClient();
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

/**********************************************************************************
 * DELETE: deleteDonationByID
 *
 * This function will set the value for is_active for the sponsor to false.
 * Sponsors cannot be fully deleted in the database to protect the data integrity.
 * Instead the sponsor can be deactivated. When a new sponsor is created, it will
 * first check to see if the sponsor exists in the deactivated status before creating
 * a new sponsor in the database.
 *
 **********************************************************************************/

export async function deleteSponsorByID(id) {
  const supabase = await createClient();

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
