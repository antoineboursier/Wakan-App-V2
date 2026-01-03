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

// --- Import / Export ---

export async function exportQuizJSON(quizId: string): Promise<any> {
    const quiz = await getQuizById(quizId);
    if (!quiz) throw new Error("Quiz non trouvé");

    const profiles = await getQuizProfiles(quizId);
    const questions = await getQuizQuestions(quizId);

    return {
        quiz,
        profiles,
        questions
    };
}

export async function importQuizJSON(data: any): Promise<void> {
    try {
        // 1. Create Quiz
        const quizData: QuizFormData = {
            title: (data.quiz.title || "Untitled") + " (Import)",
            description: data.quiz.description,
            slug: (data.quiz.slug || "quiz") + "-import-" + Date.now(),
            image_url: data.quiz.image_url,
            background_image_url: data.quiz.background_image_url,
            is_active: false,
            short_title: data.quiz.short_title,
            result_display_type: data.quiz.result_display_type || 'single'
        };

        const newQuiz = await createQuiz(quizData);
        const newQuizId = newQuiz.id;

        // 2. Create Profiles & Map IDs
        const profileIdMap = new Map<string, string>(); // Old -> New

        if (data.profiles && Array.isArray(data.profiles)) {
            for (const p of data.profiles) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id, quiz_id, created_at, updated_at, ...pData } = p;
                const newProfile = await createQuizProfile(newQuizId, pData);
                profileIdMap.set(p.id, newProfile.id);
            }
        }

        // 3. Create Questions hierarchy
        if (data.questions && Array.isArray(data.questions)) {
            for (const q of data.questions) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id, quiz_id, created_at, updated_at, answers, ...qData } = q;
                const newQuestion = await createQuizQuestion(newQuizId, qData);

                if (answers && Array.isArray(answers)) {
                    for (const a of answers) {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { id: oldAId, question_id, created_at: ca, updated_at: ua, influences, ...aData } = a;
                        const newAnswer = await createQuizAnswer(newQuestion.id, aData);

                        if (influences && Array.isArray(influences)) {
                            for (const inf of influences) {
                                // Find new profile ID
                                const newProfileId = profileIdMap.get(inf.profile_id);
                                if (newProfileId) {
                                    await upsertAnswerInfluence(newAnswer.id, newProfileId, inf.weight);
                                }
                            }
                        }
                    }
                }
            }
        }

        revalidatePath('/admin/quizzes');
    } catch (e: any) {
        console.error("Import failed:", e);
        throw new Error("L'import a échoué: " + e.message);
    }
}

export async function overwriteQuizWithImport(targetQuizId: string, data: any): Promise<void> {
    try {
        // 1. Update Main Quiz Data (Optional: keep or overwrite? Overwrite is usually expected on import)
        // We keep the ID and Slug stable usually, or we can update title/desc.
        const quizUpdate: Partial<QuizFormData> = {
            title: data.quiz.title,
            description: data.quiz.description,
            long_description: data.quiz.long_description,
            image_url: data.quiz.image_url,
            background_image_url: data.quiz.background_image_url,
            is_active: false, // Reset to draft for safety
            short_title: data.quiz.short_title,
            result_display_type: data.quiz.result_display_type || 'single',
            limit_enabled: data.quiz.limit_enabled,
            limit_count: data.quiz.limit_count,
            btn_label: data.quiz.btn_label,
            btn_icon: data.quiz.btn_icon,
            is_premium: data.quiz.is_premium
        };
        await updateQuiz(targetQuizId, quizUpdate);

        // 2. Clear Existing Content (Profiles & Questions)
        // Deleting profiles cascades to questions usually? No, questions are separate but answers depend on profiles for influences?
        // Influences reference profile_id. If we delete profiles, influences die.
        // Let's delete manually to be clean.
        // Constraints: key constraints.
        // If we delete profiles first, answer_influences might block or cascade delete.
        // If we Delete Questions first -> Answers die -> Influences die.
        // Then Delete Profiles.

        // Fetch current questions to delete
        const currentQuestions = await getQuizQuestions(targetQuizId);
        for (const q of currentQuestions) {
            await deleteQuizQuestion(q.id);
        }

        const currentProfiles = await getQuizProfiles(targetQuizId);
        for (const p of currentProfiles) {
            await deleteQuizProfile(p.id);
        }

        // 3. Re-create Profiles & Map IDs
        const profileIdMap = new Map<string, string>(); // Old JSON ID -> New DB ID

        if (data.profiles && Array.isArray(data.profiles)) {
            for (const p of data.profiles) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id, quiz_id, created_at, updated_at, ...pData } = p;
                const newProfile = await createQuizProfile(targetQuizId, pData);
                profileIdMap.set(p.id, newProfile.id);
            }
        }

        // 4. Re-create Questions
        if (data.questions && Array.isArray(data.questions)) {
            for (const q of data.questions) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id, quiz_id, created_at, updated_at, answers, ...qData } = q;
                const newQuestion = await createQuizQuestion(targetQuizId, qData);

                if (answers && Array.isArray(answers)) {
                    for (const a of answers) {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { id: oldAId, question_id, created_at: ca, updated_at: ua, influences, ...aData } = a;
                        const newAnswer = await createQuizAnswer(newQuestion.id, aData);

                        if (influences && Array.isArray(influences)) {
                            for (const inf of influences) {
                                const newProfileId = profileIdMap.get(inf.profile_id);
                                if (newProfileId) {
                                    await upsertAnswerInfluence(newAnswer.id, newProfileId, inf.weight);
                                }
                            }
                        }
                    }
                }
            }
        }

        revalidatePath(`/admin/quizzes/${targetQuizId}`);
        revalidatePath('/admin/quizzes');
    } catch (e: any) {
        throw new Error("L'import a échoué: " + e.message);
    }
}
