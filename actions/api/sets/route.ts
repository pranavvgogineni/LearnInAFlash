'use server';
import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export const getAllSets = async () => {
  let { data: sets, error } = await supabase.from('sets').select('set_name, id');
  if (error) {
    console.error("Error fetching sets:", error);
    return [];
  }
  return sets;
};
