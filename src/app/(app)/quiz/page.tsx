import { getPublicQuizzes } from "@/app/actions/quiz-public";
import { PageBackground } from "@/components/layout/PageBackground";
import { QuizCardWrapper } from "./QuizCardWrapper";

export const dynamic = 'force-dynamic';

export default async function QuizHubPage() {
    const quizzes = await getPublicQuizzes();

    return (
        <div id="quiz-list-page" className="page-wrapper mt-4">
            <PageBackground imageSrc="/backgrounds/quiz.png" alt="Espace Quiz" />

            <div id="quiz-list-content" className="page-content">
                <header className="mb-6 md:mb-8 text-center md:text-left w-full sr-only">
                    <h1 className="title-big text-[var(--accent-900)] mb-2 drop-shadow-sm">Quiz de Personnalité</h1>
                    <p className="para text-[var(--text-secondary)] opacity-80 max-w-lg mx-auto md:mx-0">
                        Mieux se connaître pour mieux grandir. Explorez nos tests introspectifs.
                    </p>
                </header>

                <div id="quiz-list-grid" className="card-grid">
                    {quizzes.map((quiz) => (
                        <QuizCardWrapper
                            key={quiz.id}
                            slug={quiz.slug}
                            title={quiz.title}
                            subtitle={quiz.description || ""}
                            imageUrl={quiz.image_url}
                            isPremium={quiz.is_premium}
                            publishedAt={quiz.published_at}
                            btnLabel={quiz.btn_label}
                            btnIcon={quiz.btn_icon}
                        />
                    ))}

                    {quizzes.length === 0 && (
                        <div className="empty-state">
                            Aucun quiz disponible pour le moment.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
