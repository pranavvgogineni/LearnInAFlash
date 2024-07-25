import {createClient} from "@/utils/supabase/server";

export default async function FlashCards() {
    const supabase = createClient();
    let { data: flashcards, error } = await supabase.from('flashcards').select('question, answer')
    const questions = flashcards?.map((flashcard) => flashcard.question)
    const answers = flashcards?.map((flashcard) => flashcard.answer)
    return (
        <>
        <div>{questions}</div>
        <div>{answers}</div>
        </>
    )
}