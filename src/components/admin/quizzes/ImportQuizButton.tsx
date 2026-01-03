"use client";

import { useRef, useState } from "react";
import { importQuizJSON } from "@/app/actions/quiz";
import { AdminIcon } from "@/components/admin/AdminIcon";

export function ImportQuizButton() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importing, setImporting] = useState(false);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!confirm("Voulez-vous importer ce quiz ? Il sera créé comme un nouveau quiz.")) {
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        setImporting(true);
        try {
            const text = await file.text();
            const json = JSON.parse(text);
            await importQuizJSON(json);
            alert("Quiz importé avec succès !");
            window.location.reload();
        } catch (error: any) {
            console.error(error);
            alert("Erreur lors de l'import: " + error.message);
        } finally {
            setImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <>
            <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />
            <button
                onClick={handleClick}
                disabled={importing}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
                {importing ? (
                    <AdminIcon icon="eos-icons:loading" className="animate-spin w-4 h-4" />
                ) : (
                    <AdminIcon icon="mdi:upload" className="w-4 h-4" />
                )}
                Importer JSON
            </button>
        </>
    );
}
