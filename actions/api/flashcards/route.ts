'use server';
import {createClient} from "@/utils/supabase/server";

const supabase = createClient();

export const getAllFlashcards = async () => {
    let { data: flashcards} = await supabase.from('flashcards').select('question, answer').eq('set_id', 1);
    return flashcards
}

export const createFlashcard = async (question: string, answer: string, set_id: number) => {
    const { data, error } = await supabase
        .from('flashcards')
        .insert({ question: question, answer: answer, set_id: set_id })
        .select();

    if (error) {
        console.log(error);
    }

    return data;
};