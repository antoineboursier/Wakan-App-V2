'use server';

import { createClient } from "@supabase/supabase-js";
import {
    Quiz, QuizFormData,
    QuizProfile, QuizProfileFormData,
    QuizQuestion, QuizQuestionFormData,
    QuizAnswer, QuizAnswerFormData,
    QuizAnswerInfluence
} from "@/types/quiz";
import { revalidatePath } from "next/cache";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// --- Quiz CRUD ---

export async function getQuizzes(): Promise<Quiz[]> {
    const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Erreur lors de la récupération des quiz (Table manquante ?):", error.message);
        return [];
    }
    return data || [];
}

export async function getQuizById(id: string): Promise<Quiz | null> {
    const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;
    return data;
}

export async function createQuiz(data: QuizFormData): Promise<Quiz> {
    const { data: newQuiz, error } = await supabase
        .from('quizzes')
        .insert([{ ...data, type: 'personality' }])
        .select()
        .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/quizzes');
    return newQuiz;
}

export async function updateQuiz(id: string, data: Partial<QuizFormData>): Promise<Quiz> {
    const { data: updatedQuiz, error } = await supabase
        .from('quizzes')
        .update(data)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/quizzes');
    revalidatePath(`/admin/quizzes/${id}`);
    return updatedQuiz;
}

export async function deleteQuiz(id: string): Promise<void> {
    const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/quizzes');
}

// --- Quiz Profiles CRUD ---

export async function getQuizProfiles(quizId: string): Promise<QuizProfile[]> {
    const { data, error } = await supabase
        .from('quiz_profiles')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
}

export async function createQuizProfile(quizId: string, data: QuizProfileFormData): Promise<QuizProfile> {
    const { data: newProfile, error } = await supabase
        .from('quiz_profiles')
        .insert([{ ...data, quiz_id: quizId }])
        .select()
        .single();

    if (error) throw new Error(error.message);

    revalidatePath(`/admin/quizzes/${quizId}`);
    return newProfile;
}

export async function updateQuizProfile(id: string, data: Partial<QuizProfileFormData>): Promise<QuizProfile> {
    const { data: updatedProfile, error } = await supabase
        .from('quiz_profiles')
        .update(data)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return updatedProfile;
}

export async function deleteQuizProfile(id: string): Promise<void> {
    const { error } = await supabase
        .from('quiz_profiles')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
}

// --- Quiz Questions CRUD ---

export async function getQuizQuestions(quizId: string): Promise<QuizQuestion[]> {
    const { data, error } = await supabase
        .from('quiz_questions')
        .select(`
            *,
            answers:quiz_answers(
                *,
                influences:quiz_answer_influences(*)
            )
        `)
        .eq('quiz_id', quizId)
        .order('order', { ascending: true });

    if (error) {
        console.error("Error fetching questions:", error.message);
        return [];
    }

    // Sort answers by order locally
    const questions = data || [];
    questions.forEach((q: any) => {
        if (q.answers) {
            q.answers.sort((a: any, b: any) => a.order - b.order);
        }
    });

    return questions as QuizQuestion[];
}

export async function createQuizQuestion(quizId: string, data: QuizQuestionFormData): Promise<QuizQuestion> {
    const { data: newQ, error } = await supabase
        .from('quiz_questions')
        .insert([{ ...data, quiz_id: quizId }])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return newQ;
}

export async function updateQuizQuestion(id: string, data: Partial<QuizQuestionFormData>): Promise<QuizQuestion> {
    const { data: updatedQ, error } = await supabase
        .from('quiz_questions')
        .update(data)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return updatedQ;
}

export async function deleteQuizQuestion(id: string): Promise<void> {
    const { error } = await supabase.from('quiz_questions').delete().eq('id', id);
    if (error) throw new Error(error.message);
}

// --- Quiz Answers CRUD ---

export async function createQuizAnswer(questionId: string, data: QuizAnswerFormData): Promise<QuizAnswer> {
    const { data: newA, error } = await supabase
        .from('quiz_answers')
        .insert([{ ...data, question_id: questionId }])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return newA;
}

export async function updateQuizAnswer(id: string, data: Partial<QuizAnswerFormData>): Promise<QuizAnswer> {
    const { data: updatedA, error } = await supabase
        .from('quiz_answers')
        .update(data)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return updatedA;
}

export async function deleteQuizAnswer(id: string): Promise<void> {
    const { error } = await supabase.from('quiz_answers').delete().eq('id', id);
    if (error) throw new Error(error.message);
}

// --- Influences (Upsert) ---

export async function upsertAnswerInfluence(answerId: string, profileId: string, weight: number): Promise<void> {
    const { error } = await supabase
        .from('quiz_answer_influences')
        .upsert(
            { answer_id: answerId, profile_id: profileId, weight },
            { onConflict: 'answer_id, profile_id' }
        );

    if (error) throw new Error(error.message);
}
