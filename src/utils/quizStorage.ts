/**
 * Utilitaire pour gérer le stockage local des résultats de quiz
 */

import { QuizProfile } from "@/types/quiz";

export interface StoredQuizResult {
    quizId: string;
    quizSlug: string;
    primary: QuizProfile & { score: number; percentage: number };
    secondary: (QuizProfile & { score: number; percentage: number })[];
    completedAt: string;
}

const STORAGE_KEY = 'wakan_quiz_results';

/**
 * Sauvegarde un résultat de quiz
 */
export function saveQuizResult(quizId: string, quizSlug: string, result: { primary: QuizProfile & { score: number; percentage: number }; secondary: (QuizProfile & { score: number; percentage: number })[] }) {
    if (typeof window === 'undefined') return;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const results: StoredQuizResult[] = stored ? JSON.parse(stored) : [];

        // Remove old result for this quiz if exists
        const filtered = results.filter(r => r.quizSlug !== quizSlug);

        // Add new result
        filtered.push({
            quizId,
            quizSlug,
            primary: result.primary,
            secondary: result.secondary,
            completedAt: new Date().toISOString()
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Error saving quiz result:', error);
    }
}

/**
 * Récupère le résultat d'un quiz par son slug
 */
export function getQuizResult(quizSlug: string): StoredQuizResult | null {
    if (typeof window === 'undefined') return null;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;

        const results: StoredQuizResult[] = JSON.parse(stored);
        return results.find(r => r.quizSlug === quizSlug) || null;
    } catch (error) {
        console.error('Error getting quiz result:', error);
        return null;
    }
}

/**
 * Récupère tous les résultats
 */
export function getAllQuizResults(): StoredQuizResult[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error getting all quiz results:', error);
        return [];
    }
}

/**
 * Supprime le résultat d'un quiz
 */
export function deleteQuizResult(quizSlug: string) {
    if (typeof window === 'undefined') return;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return;

        const results: StoredQuizResult[] = JSON.parse(stored);
        const filtered = results.filter(r => r.quizSlug !== quizSlug);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Error deleting quiz result:', error);
    }
}
