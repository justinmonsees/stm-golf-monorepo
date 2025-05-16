"use server";

import { createClient } from "@/utils/supabase/server";

/**********************************************************************************
 * READ: getHosts
 *
 * This function will get all of the hosts
 *
 **********************************************************************************/

export async function getHosts() {
  const supabase = await createClient();
  const { data: hosts, error } = await supabase.from("Hosts").select("*");

  return hosts;
}
