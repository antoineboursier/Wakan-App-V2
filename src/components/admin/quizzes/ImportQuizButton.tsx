"use client";

import { useRef, useState } from "react";
import { importQuizJSON } from "@/app/actions/quiz";
import { AdminIcon } from "@/components/admin/AdminIcon";

export function ImportQuizButton() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importing, setImporting] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
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

            console.log("🔄 Démarrage de l'import...");
            await importQuizJSON(json);
            console.log("✅ Import réussi !");

            // Use blocking alert to ensure user sees the message
            setTimeout(() => {
                alert("✅ Quiz importé avec succès !");
            }, 100);
            // No manual reload needed, revalidatePath handles it

        } catch (error: any) {
            console.error("❌ Erreur d'import:", error);

            // Extract meaningful error message
            let errorMsg = error.message || "Erreur inconnue lors de l'import";

            // Check for common errors
            if (errorMsg.includes("duplicate") || errorMsg.includes("unique constraint")) {
                errorMsg = "❌ ERREUR : Ce quiz existe déjà (slug déjà utilisé).\n\nVous ne pouvez pas créer un doublon.\n\nSolution : Modifiez le slug dans le fichier JSON avant de l'importer.";
            } else if (errorMsg.includes("quiz_slug_key")) {
                errorMsg = "❌ ERREUR : Un quiz avec ce slug existe déjà dans la base de données.\n\nSolution : Changez le slug dans votre fichier JSON.";
            } else {
                errorMsg = "❌ ERREUR D'IMPORT\n\n" + errorMsg + "\n\nConsultez la console pour plus de détails.";
            }

            // Use blocking alert - this WILL stay open until user clicks OK
            alert(errorMsg);

            // Reset state after error
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
                type="button"
                onClick={handleClick}
                disabled={importing}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {importing ? (
                    <>
                        <AdminIcon icon="eos-icons:loading" className="animate-spin w-4 h-4" />
                        <span>Import en cours...</span>
                    </>
                ) : (
                    <>
                        <AdminIcon icon="mdi:upload" className="w-4 h-4" />
                        <span>Importer JSON</span>
                    </>
                )}
            </button>
        </>
    );
}
