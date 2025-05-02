"use server";

import { createClient } from "@/utils/supabase/server";

export async function getTotalDonations() {
  const supabase = await createClient();
  const { data: total, error } = await supabase.from("Donations").select();

  return total;
}
