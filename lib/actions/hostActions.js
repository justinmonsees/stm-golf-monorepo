"use server";

import { createClient } from "@/utils/supabase/server";

/* This function will retrieve an array of all active committee members
 */
export async function getHosts() {
  const supabase = createClient();
  const { data: hosts, error } = await supabase.from("Hosts").select("*");

  return hosts;
}
