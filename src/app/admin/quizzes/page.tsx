import { getQuizzes } from "@/app/actions/quiz";
import Link from "next/link";
import { AdminIcon } from "@/components/admin/AdminIcon";

export default async function QuizzesListPage() {
    const quizzes = await getQuizzes();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Quiz de Personnalité</h1>
                <Link
                    href="/admin/quizzes/new"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <AdminIcon icon="mdi:plus" className="w-4 h-4" />
                    Nouveau Quiz
                </Link>
            </div>

            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-900/50 text-slate-200 uppercase font-medium">
                        <tr>
                            <th className="px-6 py-3">Titre</th>
                            <th className="px-6 py-3">Slug</th>
                            <th className="px-6 py-3">Statut</th>
                            <th className="px-6 py-3">Créé le</th>
                            <th className="px-6 py-3">Modifié le</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {quizzes.map((quiz) => (
                            <tr key={quiz.id} className="hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">
                                    {quiz.title}
                                    {quiz.description && (
                                        <div className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">
                                            {quiz.description}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 font-mono text-xs">
                                    {quiz.slug}
                                </td>
                                <td className="px-6 py-4">
                                    {quiz.is_active ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                                            Actif
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-400/10 text-red-400">
                                            Inactif
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-xs">
                                    <div className="text-slate-300">{new Date(quiz.created_at).toLocaleDateString("fr-FR")}</div>
                                </td>
                                <td className="px-6 py-4 text-xs">
                                    <div className="text-slate-300">{new Date(quiz.updated_at).toLocaleDateString("fr-FR")}</div>
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-3 items-center h-full">
                                    <Link
                                        href={`/admin/quizzes/${quiz.id}`}
                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        Éditer
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {quizzes.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    Aucun quiz de personnalité créé.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
