'use server';
import {createClient} from "@/utils/supabase/server";

const supabase = createClient();

export const getAllSets = async () => {
    let { data: flashcards} = await supabase.from('sets').select('set_name')
    return flashcards
}