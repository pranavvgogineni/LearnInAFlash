'use server';
import {createClient} from "@/utils/supabase/server";

const supabase = createClient();

export const getAllFlashcards = async () => {
    let { data: flashcards} = await supabase.from('flashcards').select('question, answer').eq('set_id', 1);
    return flashcards
}

export const createFlashcard = async (question: string, answer: string) => {
    const { error } = await supabase.from('flashcards').insert({ question: question, answer: answer });
    if (error) {
        console.log(error);
    }
}