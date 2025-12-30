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
export async function calculateQuizResult(quizId: string, answerIds: string[]): Promise<QuizProfile | null> {
    if (!answerIds.length) return null;

    // 1. Récupérer toutes les influences liées aux réponses choisies
    const { data: influences, error } = await supabaseAdmin
        .from('quiz_answer_influences')
        .select('profile_id, weight')
        .in('answer_id', answerIds);

    if (error || !influences) {
        console.error("Error calculating result:", error);
        throw new Error("Impossible de calculer le résultat");
    }

    // 2. Calculer le score par profil
    const scores: Record<string, number> = {};
    influences.forEach(inf => {
        scores[inf.profile_id] = (scores[inf.profile_id] || 0) + inf.weight;
    });

    // 3. Trouver le profil avec le score max
    // En cas d'égalité, on devrait idéalement utiliser l'ordre des profils, 
    // mais pour l'instant on prend le premier trouvé ou on pourrait fetcher les profils pour trier par 'order'.

    let maxScore = -Infinity;
    let winningProfileIds: string[] = [];

    for (const [pid, score] of Object.entries(scores)) {
        if (score > maxScore) {
            maxScore = score;
            winningProfileIds = [pid];
        } else if (score === maxScore) {
            winningProfileIds.push(pid);
        }
    }

    if (winningProfileIds.length === 0) return null;

    // 4. Récupérer le profil gagnant (avec gestion égalité via 'order')
    const { data: winningProfile, error: profileError } = await supabaseAdmin
        .from('quiz_profiles')
        .select('*')
        .in('id', winningProfileIds)
        .order('order', { ascending: true }) // Le plus petit 'order' gagne en cas d'égalité (priorité arbitraire définie par l'admin)
        .limit(1)
        .single();

    if (profileError) return null;

    return winningProfile;
}
