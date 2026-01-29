"use client";

import { useState, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { uploadImage } from "@/app/admin/actions";
import { useToast } from "@/components/ui/Toast";

interface GlobalModuleSettingsFormProps {
    moduleId: string;
    initialConfig: any; // Using any for flexibility with DB row
}

export function GlobalModuleSettingsForm({ moduleId, initialConfig }: GlobalModuleSettingsFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Refs for file inputs
    const bgInputRef = useRef<HTMLInputElement>(null);

    // Form State (Only editing background image for now as requested)
    const [backgroundImage, setBackgroundImage] = useState(initialConfig?.background_image_url || '');

    // Detect Changes
    const hasChanges = backgroundImage !== (initialConfig?.background_image_url || '');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleUpload = async (file: File) => {
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', file);
            const url = await uploadImage(fd);
            if (url) {
                setBackgroundImage(url);
            }
        } catch (e: any) {
            showToast("Erreur upload: " + (e.message || e), "error");
        } finally {
            setUploading(false);
        }
    };

    const triggerUpload = () => {
        bgInputRef.current?.click();
    };

    const handleSubmit = async () => {
        if (!hasChanges) return;
        setSaving(true);

        const { error } = await supabase
            .from('astral_modules')
            .upsert({
                id: moduleId,
                background_image_url: backgroundImage,
                updated_at: new Date().toISOString()
            })
            .select();

        setSaving(false);

        if (error) {
            showToast("Erreur lors de la sauvegarde : " + error.message, "error");
        } else {
            showToast("Configuration globale enregistrée", "success");
            router.refresh();
        }
    };

    return (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Icon icon="mdi:cog" className="text-slate-400" />
                    Configuration Globale
                </h2>
                <button
                    onClick={handleSubmit}
                    disabled={!hasChanges || saving}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${hasChanges && !saving
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : "bg-slate-700 text-slate-400 cursor-not-allowed"
                        }`}
                >
                    {saving ? 'Sauvegarde...' : 'Enregistrer'}
                </button>
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300">
                    Image de fond globale (appliquée à tous les signes)
                </label>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Preview */}
                    <div className="relative w-full md:w-64 h-40 bg-slate-900 border border-slate-600 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                        {backgroundImage ? (
                            <Image
                                src={backgroundImage}
                                alt="Global Background"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center text-slate-600">
                                <Icon icon="mdi:image-off-outline" width={32} />
                                <span className="text-xs mt-2">Aucune image</span>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex-1 space-y-3">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={backgroundImage}
                                onChange={e => setBackgroundImage(e.target.value)}
                                className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="URL de l'image..."
                            />
                            <input
                                type="file"
                                ref={bgInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                            />
                            <button
                                type="button"
                                disabled={uploading}
                                onClick={triggerUpload}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
                            >
                                <Icon icon="mdi:upload" /> {uploading ? '...' : 'Charger'}
                            </button>
                        </div>
                        <p className="text-xs text-slate-500">
                            Cette image remplacera le fond par défaut pour toutes les pages de détail du profil Zodiac.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
