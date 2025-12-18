import { getDrawTypes } from "./actions";
import { Icon } from "@iconify/react";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    const drawTypes = await getDrawTypes();
    const count = drawTypes.length;

    return (
        <div className="space-y-6" id="admin-dashboard-page">
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card Count Tirages */}
                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Tirages Configurés</div>
                        <div className="text-3xl font-bold text-white">{count}</div>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-full text-blue-400">
                        <Icon icon="mdi:cards-playing-outline" className="w-8 h-8" />
                    </div>
                </div>

                {/* Placeholder for future stats */}
                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-sm flex items-center justify-between opacity-50">
                    <div>
                        <div className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Utilisateurs (Bientôt)</div>
                        <div className="text-3xl font-bold text-slate-600">-</div>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded-full text-slate-600">
                        <Icon icon="mdi:account-group-outline" className="w-8 h-8" />
                    </div>
                </div>
            </div>
        </div>
    );
}
