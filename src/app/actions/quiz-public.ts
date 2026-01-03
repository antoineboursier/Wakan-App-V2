'use server';

import { createClient } from "@supabase/supabase-js";
import { Quiz, QuizQuestion, QuizProfile } from "@/types/quiz";

// Client Supabase avec clé publique (suffisant pour le SELECT si RLS bien configuré)
// Mais pour le calcul, on veut éviter que le client puisse voir les poids.
// On utilise donc le client admin pour le calcul (serveur only) pour garantir l'integrité du résultat.
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Récupère les quiz publiés pour le listing
 */
export async function getPublicQuizzes(): Promise<Quiz[]> {
    const { data, error } = await supabaseAdmin
        .from('quizzes')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching public quizzes:", error);
        return [];
    }
    return data || [];
}

/**
 * Récupère un quiz complet (Questions + Réponses) par son slug
 * NE RENVOIE PAS les influences (poids) pour ne pas tricher côté front.
 */
export async function getPublicQuizBySlug(slug: string): Promise<{ quiz: Quiz, questions: QuizQuestion[] } | null> {
    // 1. Get Quiz
    const { data: quiz, error: quizError } = await supabaseAdmin
        .from('quizzes')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (quizError || !quiz) return null;

    // 2. Get Questions & Answers (Sans les influences pour la sécurité)
    const { data: questionsData, error: qError } = await supabaseAdmin
        .from('quiz_questions')
        .select(`
            id,
            question_text,
            order,
            answers:quiz_answers(
                id,
                answer_text,
                order
            )
        `)
        .eq('quiz_id', quiz.id)
        .order('order', { ascending: true });

    if (qError) return null;

    // Sort answers by order inside questions
    const questions = questionsData?.map((q: any) => ({
        ...q,
        answers: q.answers?.sort((a: any, b: any) => a.order - b.order) || []
    })) as QuizQuestion[];

    return { quiz, questions };
}

/**
 * BOÎTE NOIRE : Calcule le résultat basé sur les réponses
 */
/**
 * BOÎTE NOIRE : Calcule le résultat basé sur les réponses
 * Retourne le profil principal et les profils secondaires (si activé)
 */
export async function calculateQuizResult(quizId: string, answerIds: string[]): Promise<{ primary: QuizProfile & { score: number, percentage: number }, secondary: (QuizProfile & { score: number, percentage: number })[] } | null> {
    if (!answerIds.length) return null;

    // 1. Get Quiz Config (for multiple display check)
    const { data: quiz, error: quizError } = await supabaseAdmin
        .from('quizzes')
        .select('result_display_type')
        .eq('id', quizId)
        .single();

    if (quizError) return null;

    // 2. Récupérer toutes les influences liées aux réponses choisies
    const { data: influences, error } = await supabaseAdmin
        .from('quiz_answer_influences')
        .select('profile_id, weight')
        .in('answer_id', answerIds);

    if (error || !influences) {
        console.error("Error calculating result:", error);
        throw new Error("Impossible de calculer le résultat");
    }

    // 3. Calculer le score par profil
    const scores: Record<string, number> = {};
    influences.forEach(inf => {
        scores[inf.profile_id] = (scores[inf.profile_id] || 0) + inf.weight;
    });

    // 4. Determiner Max Score et Candidats
    let maxScore = -Infinity;
    for (const s of Object.values(scores)) {
        if (s > maxScore) maxScore = s;
    }

    if (maxScore === -Infinity) return null;

    const primaryCandidates: string[] = [];
    const secondaryCandidates: string[] = [];

    const threshold = maxScore * 0.7;
    const isMultiple = quiz.result_display_type === 'multiple';

    for (const [pid, score] of Object.entries(scores)) {
        if (score === maxScore) {
            primaryCandidates.push(pid);
        } else if (isMultiple && score >= threshold) {
            secondaryCandidates.push(pid);
        }
    }

    // 5. Fetch details
    const allIds = [...primaryCandidates, ...secondaryCandidates];

    const { data: profiles, error: profileError } = await supabaseAdmin
        .from('quiz_profiles')
        .select('*')
        .in('id', allIds)
        .order('order', { ascending: true });

    if (profileError || !profiles || profiles.length === 0) return null;

    // 6. Select Primary (Tie-break via order)
    const primaryProfileBase = profiles.find(p => primaryCandidates.includes(p.id));
    if (!primaryProfileBase) return null;

    const primaryProfile = {
        ...primaryProfileBase,
        score: scores[primaryProfileBase.id],
        percentage: 100 // Winner is always reference 100%
    };

    // 7. Select Secondary (sorted by score desc)
    let secondaryProfiles: (QuizProfile & { score: number, percentage: number })[] = [];
    if (isMultiple) {
        secondaryProfiles = profiles
            .filter(p => p.id !== primaryProfile.id)
            .sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0))
            .map(p => ({
                ...p,
                score: scores[p.id],
                percentage: maxScore > 0 ? Math.round((scores[p.id] / maxScore) * 100) : 0 // Relative to winner
            }));
    }

    return {
        primary: primaryProfile,
        secondary: secondaryProfiles
    };
}
