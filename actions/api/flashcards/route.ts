'use server';
import {createClient} from "@/utils/supabase/server";

const supabase = createClient();

export const getAllFlashcards = async (set_id: number) => {
    let { data: flashcards } = await supabase
      .from('flashcards')
      .select('question, answer, set_id')
      .eq('set_id', set_id);
    return flashcards;
  };

export const getFlashcard = async (id: number, set_id: number) => {
    let { data: flashcard } = await supabase
      .from('flashcards')
      .select('question, answer')
      .eq('set_id', set_id,)
      .eq('id', id)
      .single();
    return flashcard;
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