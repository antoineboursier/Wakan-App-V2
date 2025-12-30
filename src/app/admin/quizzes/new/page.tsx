import { QuizEditor } from "@/components/admin/quizzes/QuizEditor";
import { AdminIcon } from "@/components/admin/AdminIcon";
import Link from "next/link";

export default function NewQuizPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 text-slate-400 text-sm">
                <Link href="/admin/quizzes" className="hover:text-white transition-colors">
                    Quiz
                </Link>
                <AdminIcon icon="mdi:chevron-right" width="16" />
                <span className="text-white">Nouveau Quiz</span>
            </div>

            <QuizEditor />
        </div>
    );
}
