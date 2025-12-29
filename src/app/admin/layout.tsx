import type { Metadata } from "next";
import "./admin.css";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

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
                <div id="admin-layout-root" className="min-h-screen">
                    <AdminSidebar />
                    <main id="admin-main-content" className="p-6 md:ml-64 pt-20 md:pt-6 transition-all duration-300">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
