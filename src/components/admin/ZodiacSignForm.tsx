"use client";

import { useState, useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { uploadImage } from "@/app/admin/actions";
import { useToast } from "@/components/ui/Toast";

interface ZodiacSignFormProps {
    sign: any;
}

export function ZodiacSignForm({ sign }: ZodiacSignFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<'iconGlow' | 'heroImage' | 'backgroundImage' | null>(null);

    // Refs for file inputs
    // Refs for file inputs
    const iconInputRef = useRef<HTMLInputElement>(null);
    const heroInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [formData, setFormData] = useState({
        displayName: sign.display_name,
        descriptionMain: sign.description_main || '',
        iconGlow: sign.icon_glow || '',
        heroImage: sign.hero_image || ''
    });

    // Detect Changes
    const hasChanges = (
        formData.displayName !== sign.display_name ||
        formData.descriptionMain !== (sign.description_main || '') ||
        formData.iconGlow !== (sign.icon_glow || '') ||
        formData.heroImage !== (sign.hero_image || '')
    );

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleUpload = async (file: File, field: 'iconGlow' | 'heroImage' | 'backgroundImage') => {
        setUploading(field);
        try {
            const fd = new FormData();
            fd.append('file', file);
            const url = await uploadImage(fd);
            if (url) {
                setFormData(prev => ({ ...prev, [field]: url }));
            }
        } catch (e: any) {
            showToast("Erreur upload: " + e.message || e, "error");
        } finally {
            setUploading(null);
        }
    };

    const triggerUpload = (ref: React.RefObject<HTMLInputElement | null>) => {
        ref.current?.click();
    };

    const handleSubmit = async () => {
        if (!hasChanges) return;
        setSaving(true);

        const { error } = await supabase
            .from('zodiac_signs')
            .update({
                display_name: formData.displayName,
                description_main: formData.descriptionMain,
                icon_glow: formData.iconGlow,
                hero_image: formData.heroImage,
                updated_at: new Date().toISOString()
            })
            .eq('slug', sign.slug);

        setSaving(false);

        if (error) {
            showToast("Erreur lors de la sauvegarde : " + error.message, "error");
        } else {
            showToast("Modifications enregistrées avec succès", "success");
            router.refresh();
        }
    };

    const handleReset = () => {
        setFormData({
            displayName: sign.display_name,
            descriptionMain: sign.description_main || '',
            iconGlow: sign.icon_glow || '',
            heroImage: sign.hero_image || ''
        });
    };

    return (
        <div className="space-y-8 pb-20 relative">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-slate-700 pb-6">
                <Link href="/admin/astral/zodiac" className="text-slate-400 hover:text-white transition-colors">
                    <Icon icon="mdi:arrow-left" className="w-6 h-6" />
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-white capitalize">{sign.display_name}</h1>
                        <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">
                            {sign.slug}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {hasChanges && (
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-4 py-2 rounded text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                        >
                            Annuler
                        </button>
                    )}
                    <button
                        onClick={handleSubmit}
                        disabled={!hasChanges || saving}
                        className={`px-6 py-2 rounded text-sm font-medium transition-colors ${hasChanges && !saving
                            ? "bg-blue-600 hover:bg-blue-500 text-white"
                            : "bg-slate-700 text-slate-400 cursor-not-allowed"
                            }`}
                    >
                        {saving ? 'Sauvegarde...' : 'Enregistrer'}
                    </button>
                </div>
            </div>

            {/* Form Content */}
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 space-y-6 max-w-4xl mx-auto">

                <h2 className="text-lg font-medium text-white border-b border-slate-700 pb-2 mb-4">Informations Générales</h2>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Label zodiac</label>
                    <input
                        type="text"
                        value={formData.displayName}
                        onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Description principale</label>
                    <textarea
                        value={formData.descriptionMain}
                        onChange={e => setFormData({ ...formData, descriptionMain: e.target.value })}
                        rows={4}
                        className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <div className="space-y-6 pt-4 border-t border-slate-700">
                    <h2 className="text-lg font-medium text-white pb-2">Visuels</h2>

                    {/* Icone */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                            Icône (Image)
                        </label>
                        <div className="flex items-start gap-4">
                            {/* Preview Carrée */}
                            <div className="w-16 h-16 bg-slate-900 border border-slate-600 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                                {formData.iconGlow ? (
                                    formData.iconGlow.startsWith('http') || formData.iconGlow.startsWith('/') ? (
                                        <Image
                                            src={formData.iconGlow}
                                            alt="Icon"
                                            fill
                                            className="object-contain p-2"
                                        />
                                    ) : (
                                        <Icon icon={formData.iconGlow} className="text-2xl text-white" />
                                    )
                                ) : (
                                    <Icon icon="mdi:image-off-outline" className="text-slate-600" />
                                )}
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.iconGlow}
                                        onChange={e => setFormData({ ...formData, iconGlow: e.target.value })}
                                        className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="URL ou ID Iconify..."
                                    />
                                    <input
                                        type="file"
                                        ref={iconInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'iconGlow')}
                                    />
                                    <button
                                        type="button"
                                        disabled={uploading === 'iconGlow'}
                                        onClick={() => triggerUpload(iconInputRef)}
                                        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors flex items-center gap-2"
                                    >
                                        <Icon icon="mdi:upload" /> {uploading === 'iconGlow' ? '...' : 'Charger'}
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500">Formats: PNG, WEBP, SVG. Recommandé: Transparent, 64x64px.</p>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">Image Hero (Grande)</label>
                        <div className="flex flex-col gap-4">
                            {/* Preview Large */}
                            <div className="relative w-full h-64 bg-slate-900 border border-slate-600 rounded-lg overflow-hidden flex items-center justify-center">
                                {formData.heroImage ? (
                                    <Image
                                        src={formData.heroImage}
                                        alt="Hero Preview"
                                        fill
                                        className="object-contain"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-slate-600">
                                        <Icon icon="mdi:image-off-outline" width={48} />
                                        <span className="text-sm mt-2">Aucune image</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={formData.heroImage}
                                    onChange={e => setFormData({ ...formData, heroImage: e.target.value })}
                                    className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="URL de l'image..."
                                />
                                <input
                                    type="file"
                                    ref={heroInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'heroImage')}
                                />
                                <button
                                    type="button"
                                    disabled={uploading === 'heroImage'}
                                    onClick={() => triggerUpload(heroInputRef)}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors flex items-center gap-2"
                                >
                                    <Icon icon="mdi:upload" /> {uploading === 'heroImage' ? '...' : 'Charger une image'}
                                </button>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
