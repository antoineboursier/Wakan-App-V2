import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
    title: "Wakan Admin",
    description: "Back-Office",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" className="dark">
            <body className="min-h-screen bg-slate-900 text-slate-200" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                <style>{`
            body, h1, h2, h3, h4, h5, h6, input, textarea, button, select {
                font-family: system-ui, -apple-system, sans-serif !important;
            }
        `}</style>
                <div id="admin-layout-root" className="min-h-screen flex flex-col">
                    <nav id="admin-nav" className="border-b border-slate-700 bg-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                        <div className="flex items-center gap-8">
                            <span className="font-bold text-xl text-white tracking-tight">Wakan<span className="text-blue-500">Admin</span></span>

                            <div className="flex items-center gap-1">
                                <a href="/admin" className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-all">
                                    Dashboard
                                </a>
                                <a href="/admin/draw-types" className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-all">
                                    Tirages
                                </a>
                            </div>
                        </div>
                        <a href="/" className="text-xs font-semibold bg-slate-700 text-slate-200 px-3 py-1.5 rounded hover:bg-blue-600 hover:text-white transition-colors border border-slate-600 hover:border-blue-500">
                            Retour App
                        </a>
                    </nav>
                    <main id="admin-main-content" className="p-6 max-w-5xl mx-auto w-full flex-1">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
