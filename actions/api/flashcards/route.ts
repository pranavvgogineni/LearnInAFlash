'use server';
import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export const getAllFlashcards = async (set_id: number) => {
  const { data, error } = await supabase
    .from('flashcards')
    .select('id, set_id, question, answer, level')
    .eq('set_id', set_id);
  if (error) {
    console.error("Error fetching flashcards:", error);
  }
  return data;
};

export const getFlashcard = async (id: number, set_id: number) => {
  let { data: flashcard } = await supabase
    .from('flashcards')
    .select('question, answer')
    .eq('set_id', set_id)
    .eq('id', id)
    .single();
  return flashcard;
};

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

export const updateFlashcard = async (id: number, question: string, answer: string) => {
  const { data, error } = await supabase
    .from('flashcards')
    .update({ question: question, answer: answer })
    .eq('id', id)
    .single();

    return data;
};
export const deleteFlashcard = async (id: number) => {
  const { data, error } = await supabase
    .from('flashcards')
    .delete()
    .eq('id', id);

  return data;
}
export const updateFlashcardLevel = async (id: number, newLevel: number) => {
  const { data, error } = await supabase
    .from('flashcards')
    .update({ level: newLevel })
    .eq('id', id);
  if (error) {
    console.error("Error updating flashcard level:", error);
  }
  return data;
};

export const resetFlashcardLevels = async (set_id: number) => {
  const { data, error } = await supabase
    .from('flashcards')
    .update({ level: 1 })
    .eq('set_id', set_id);
  if (error) {
    console.error("Error resetting flashcard levels:", error);
  }
  return data;
};
