'use server';
import {createClient} from "@/utils/supabase/server";

export default async function FlashCards() {
    const supabase = createClient();
    let { data: flashcards} = await supabase.from('flashcards').select('question, answer')
    return flashcards
}