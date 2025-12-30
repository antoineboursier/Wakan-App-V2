import { getQuizById } from "@/app/actions/quiz";
import { QuizEditor } from "@/components/admin/quizzes/QuizEditor";
import { AdminIcon } from "@/components/admin/AdminIcon";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditQuizPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const quiz = await getQuizById(id);

    if (!quiz) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 text-slate-400 text-sm">
                <Link href="/admin/quizzes" className="hover:text-white transition-colors">
                    Quiz
                </Link>
                <AdminIcon icon="mdi:chevron-right" width="16" />
                <span className="truncate max-w-[200px]">{quiz.title}</span>
                <AdminIcon icon="mdi:chevron-right" width="16" />
                <span className="text-white">Édition</span>
            </div>

            <QuizEditor quiz={quiz} />
        </div>
    );
}
