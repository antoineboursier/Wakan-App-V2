import { notFound } from "next/navigation";
import { getPublicQuizBySlug } from "@/app/actions/quiz-public";
import { QuizClient } from "@/components/quiz/QuizClient";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function QuizPlayPage({ params }: PageProps) {
    const { slug } = await params;
    const data = await getPublicQuizBySlug(slug);

    if (!data) {
        notFound();
    }

    return <QuizClient quiz={data.quiz} questions={data.questions} />;
}
