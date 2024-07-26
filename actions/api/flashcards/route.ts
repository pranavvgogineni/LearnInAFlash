'use server';
import {createClient} from "@/utils/supabase/server";

export const getAllFlashcards = async () => {
    const supabase = createClient();
    let { data: flashcards} = await supabase.from('flashcards').select('question, answer').eq('set_id', 1);
    return flashcards
}