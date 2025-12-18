'use client';

import { getDrawType, updateDrawType, addDrawItem, updateDrawItem, deleteDrawItem, uploadImage } from "../../actions";
import { DrawType, DrawItem } from "@/types/draws";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import clsx from "clsx";

export default function EditDrawTypePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [drawType, setDrawType] = useState<DrawType | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'general' | 'data'>('general');

    // Form Local State for tracking changes
    type FormStateType = {
        title: string;
        description: string;
        image_url: string;
        background_image_url: string;
        intro_subtitle: string;
        btn_main_label: string;
        btn_main_icon: string;
        btn_second_label: string;
        btn_second_icon: string;
        btn_second_enabled: boolean;
        is_premium: boolean;
        btn_second_is_premium: boolean;
        is_active: boolean;
    };

    const [formState, setFormState] = useState<FormStateType | null>(null);

    // Item form state for modal
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [editingItem, setEditingItem] = useState<DrawItem | null>(null);
    const [itemImagePreview, setItemImagePreview] = useState('');

    useEffect(() => {
        if (editingItem) {
            setItemImagePreview(editingItem.image_url || '');
        } else if (isAddingItem) {
            setItemImagePreview('');
        }
    }, [editingItem, isAddingItem]);

    useEffect(() => {
        async function load() {
            try {
                const id = (await params).id;
                const data = await getDrawType(id);
                if (!data) throw new Error("Type non trouvé");
                setDrawType(data);
                // Init form state
                setFormState({
                    title: data.title,
                    description: data.description || '',
                    image_url: data.image_url || '',
                    background_image_url: data.background_image_url || '',
                    intro_subtitle: data.intro_subtitle || '',
                    btn_main_label: data.btn_main_label || 'Tirer une carte',
                    btn_main_icon: data.btn_main_icon || 'mdi:cards-outline',
                    btn_second_label: data.btn_second_label || 'Tirage complet',
                    btn_second_icon: data.btn_second_icon || 'mdi:cards-playing-outline',
                    btn_second_enabled: data.btn_second_enabled ?? false,
                    is_premium: data.is_premium ?? false,
                    btn_second_is_premium: data.btn_second_is_premium ?? true,
                    is_active: data.is_active
                });
            } catch (e) {
                setError(e instanceof Error ? e.message : "Erreur de chargement");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [params]);

    // Check for changes
    const hasChanges = formState && drawType && (
        formState.title !== drawType.title ||
        formState.description !== (drawType.description || '') ||
        formState.image_url !== (drawType.image_url || '') ||
        formState.background_image_url !== (drawType.background_image_url || '') ||
        formState.intro_subtitle !== (drawType.intro_subtitle || '') ||
        formState.btn_main_label !== (drawType.btn_main_label || 'Tirer une carte') ||
        formState.btn_main_icon !== (drawType.btn_main_icon || 'mdi:cards-outline') ||
        formState.btn_second_label !== (drawType.btn_second_label || 'Tirage complet') ||
        formState.btn_second_icon !== (drawType.btn_second_icon || 'mdi:cards-playing-outline') ||
        formState.btn_second_enabled !== (drawType.btn_second_enabled ?? false) ||
        formState.is_premium !== (drawType.is_premium ?? false) ||
        formState.btn_second_is_premium !== (drawType.btn_second_is_premium ?? true) ||
        formState.is_active !== drawType.is_active
    );

    const handleReset = () => {
        if (!drawType) return;
        setFormState({
            title: drawType.title,
            description: drawType.description || '',
            image_url: drawType.image_url || '',
            background_image_url: drawType.background_image_url || '',
            intro_subtitle: drawType.intro_subtitle || '',
            btn_main_label: drawType.btn_main_label || 'Tirer une carte',
            btn_main_icon: drawType.btn_main_icon || 'mdi:cards-outline',
            btn_second_label: drawType.btn_second_label || 'Tirage complet',
            btn_second_icon: drawType.btn_second_icon || 'mdi:cards-playing-outline',
            btn_second_enabled: drawType.btn_second_enabled ?? false,
            is_premium: drawType.is_premium ?? false,
            btn_second_is_premium: drawType.btn_second_is_premium ?? true,
            is_active: drawType.is_active
        });
    };

    // Helper for input change
    const handleChange = (field: keyof FormStateType, value: any) => {
        setFormState(prev => prev ? ({ ...prev, [field]: value }) : null);
    };

    // Image Compression Utility
    async function compressToWebP(file: File): Promise<File> {
        // SVG: Vector format, do not rasterize.
        if (file.type === 'image/svg+xml') return file;

        // Skip if already WebP to avoid re-compression artifacts? 
        // Actually, re-compressing might be useful if the user uploads a huge WebP.
        // But for safety and speed, we mainly want to catch PNG/JPG.

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    URL.revokeObjectURL(img.src);
                    resolve(file); // Fallback to original
                    return;
                }
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    URL.revokeObjectURL(img.src);
                    if (!blob) {
                        resolve(file); // Fallback
                        return;
                    }
                    // Create new File with .webp extension
                    const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                    const newFile = new File([blob], newFileName, {
                        type: "image/webp",
                        lastModified: Date.now(),
                    });
                    console.log(`[Compression] Converted ${file.name} (${(file.size / 1024).toFixed(1)}kb) to ${newFileName} (${(newFile.size / 1024).toFixed(1)}kb)`);
                    resolve(newFile);
                }, "image/webp", 0.85); // 85% Quality is a good balance
            };
            img.onerror = (e) => {
                URL.revokeObjectURL(img.src);
                console.warn("Image load failed for compression, using original.", e);
                resolve(file);
            };
        });
    }

    async function handleUpload(file: File): Promise<string | null> {
        try {
            console.log("Processing upload for:", file.name, file.type);

            // Client-side optimization
            const processedFile = await compressToWebP(file);

            const fd = new FormData();
            fd.append('file', processedFile);
            const url = await uploadImage(fd);
            return url;
        } catch (e) {
            console.error(e);
            alert("Erreur upload: " + e);
            return null;
        }
    }

    // --- Actions Main Form ---

    async function handleUpdate() {
        if (!drawType || !formState) return;
        setSaving(true);
        try {
            const updateData = {
                title: formState.title,
                description: formState.description,
                image_url: formState.image_url,
                background_image_url: formState.background_image_url,
                intro_subtitle: formState.intro_subtitle,
                btn_main_label: formState.btn_main_label,
                btn_main_icon: formState.btn_main_icon,
                btn_second_label: formState.btn_second_label,
                btn_second_icon: formState.btn_second_icon,
                btn_second_enabled: formState.btn_second_enabled,
                is_premium: formState.is_premium,
                btn_second_is_premium: formState.btn_second_is_premium,
                is_active: formState.is_active,
            };

            const updated = await updateDrawType(drawType.id, updateData);
            setDrawType(prev => prev ? { ...prev, ...updated, items: prev.items } : null); // Keep items

            // Sync form state
            setFormState({
                title: updated.title,
                description: updated.description || '',
                image_url: updated.image_url || '',
                background_image_url: updated.background_image_url || '',
                intro_subtitle: updated.intro_subtitle || '',
                btn_main_label: updated.btn_main_label || 'Tirer une carte',
                btn_main_icon: updated.btn_main_icon || 'mdi:cards-outline',
                btn_second_label: updated.btn_second_label || 'Tirage complet',
                btn_second_icon: updated.btn_second_icon || 'mdi:cards-playing-outline',
                btn_second_enabled: updated.btn_second_enabled ?? false,
                is_premium: updated.is_premium ?? false,
                btn_second_is_premium: updated.btn_second_is_premium ?? true,
                is_active: updated.is_active
            });

        } catch (e) {
            alert("Erreur: " + e);
        } finally {
            setSaving(false);
        }
    }


    // --- Actions Items ---

    async function handleAddItem(formData: FormData) {
        if (!drawType) return;
        try {
            const rawData = {
                name: formData.get('item_name') as string,
                slug: formData.get('item_slug') as string,
                long_description: formData.get('item_long_desc') as string,
                reversed_description: formData.get('item_reversed_desc') as string || null,
                image_url: formData.get('item_image') as string,
                is_active: true
            };
            // @ts-ignore
            await addDrawItem(drawType.id, rawData);

            const fresh = await getDrawType(drawType.id);
            setDrawType(fresh);
            setIsAddingItem(false);
        } catch (e) {
            alert("Erreur ajout carte: " + e);
        }
    }

    async function handleUpdateItemInternal(id: string, formData: FormData) {
        if (!drawType) return;
        try {
            const rawData = {
                name: formData.get('item_name') as string,
                slug: formData.get('item_slug') as string,
                long_description: formData.get('item_long_desc') as string,
                reversed_description: formData.get('item_reversed_desc') as string || null,
                image_url: formData.get('item_image') as string,
            };
            // @ts-ignore
            await updateDrawItem(id, drawType.id, rawData);

            const fresh = await getDrawType(drawType.id);
            setDrawType(fresh);
            setEditingItem(null);
        } catch (e) {
            alert("Erreur modification carte: " + e);
        }
    }

    async function handleDeleteItemInternal(id: string) {
        if (!drawType || !confirm("Supprimer définitivement cette donnée (carte/rune) ?")) return;
        try {
            await deleteDrawItem(id, drawType.id);
            const fresh = await getDrawType(drawType.id);
            setDrawType(fresh);
            setEditingItem(null); // Close modal if open
        } catch (e) {
            alert("Erreur suppression carte: " + e);
        }
    }


    if (loading) return <div className="text-white p-10">Chargement...</div>;
    if (error || !drawType || !formState) return <div className="text-red-400 p-10">{error || "Erreur inattendue"}</div>;

    const ToggleActive = () => (
        <button
            type="button"
            onClick={() => handleChange('is_active', !formState.is_active)}
            className="flex items-center gap-3 group focus:outline-none"
        >
            <div className={clsx("w-12 h-6 rounded-full p-1 transition-colors duration-300 relative", formState.is_active ? "bg-green-500" : "bg-slate-600")}>
                <div className={clsx("w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300", formState.is_active ? "translate-x-6" : "translate-x-0")} />
            </div>
            <span className={clsx("text-sm font-medium transition-colors", formState.is_active ? "text-green-400" : "text-slate-400")}>
                {formState.is_active ? "Publié" : "Brouillon"}
            </span>
        </button>
    );

    return (
        <div id="admin-edit-type-page" className="max-w-5xl mx-auto space-y-8 pb-20 relative">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-slate-700 pb-6">
                <Link href="/admin/draw-types" className="text-slate-400 hover:text-white transition-colors">
                    <Icon icon="mdi:arrow-left" className="w-6 h-6" />
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-white">{drawType.title}</h1>
                        <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">
                            {drawType.slug}
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
                        onClick={handleUpdate}
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

            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-slate-700">
                <button
                    onClick={() => setActiveTab('general')}
                    className={clsx("pb-4 text-sm font-medium transition-colors relative", activeTab === 'general' ? "text-white" : "text-slate-400 hover:text-slate-200")}
                >
                    Général
                    {activeTab === 'general' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />}
                </button>
                <button
                    onClick={() => setActiveTab('data')}
                    className={clsx("pb-4 text-sm font-medium transition-colors relative", activeTab === 'data' ? "text-white" : "text-slate-400 hover:text-slate-200")}
                >
                    Valeurs (Contenu)
                    {activeTab === 'data' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />}
                </button>
            </div>

            {/* Content Active Tab */}
            <div className="min-h-[400px]">

                {/* --- TAB: GENERAL --- */}
                {activeTab === 'general' && (
                    <div className="animate-in fade-in duration-300 max-w-3xl">
                        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 space-y-6">
                            <div className="space-y-4">
                                <h2 className="text-lg font-medium text-white border-b border-slate-700 pb-2 mb-4">Informations Principales</h2>

                                <div className="grid grid-cols-2 gap-6 items-start">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-300">Titre</label>
                                        <input
                                            type="text"
                                            value={formState.title}
                                            onChange={(e) => handleChange('title', e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2 pt-6">
                                        <ToggleActive />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-300">Description</label>
                                    <textarea
                                        value={formState.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        rows={3}
                                        className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-300">Sous-titre (Intro)</label>
                                    <input
                                        type="text"
                                        value={formState.intro_subtitle}
                                        onChange={(e) => handleChange('intro_subtitle', e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Configuration des Boutons */}
                            <div className="space-y-4 pt-4 border-t border-slate-700">
                                <h2 className="text-lg font-medium text-white pb-2">Configuration des Boutons</h2>

                                {/* Bouton Principal */}
                                <div className="p-4 bg-slate-900 rounded-lg space-y-4 border border-slate-700">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Tirage Principal (Simple)</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs text-slate-500">Label</label>
                                            <input
                                                type="text"
                                                value={formState.btn_main_label}
                                                onChange={(e) => handleChange('btn_main_label', e.target.value)}
                                                className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-slate-500 flex items-center gap-2">
                                                Icône <a href="https://icon-sets.iconify.design/" target="_blank" className="text-blue-400 hover:universe"><Icon icon="mdi:open-in-new" width="12" /></a>
                                            </label>
                                            <div className="flex gap-2">
                                                <div className="w-10 h-10 bg-slate-800 border border-slate-600 rounded flex items-center justify-center text-white">
                                                    <Icon icon={formState.btn_main_icon} width="20" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={formState.btn_main_icon}
                                                    onChange={(e) => handleChange('btn_main_icon', e.target.value)}
                                                    className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <input
                                            type="checkbox"
                                            id="is_premium"
                                            checked={formState.is_premium}
                                            onChange={(e) => handleChange('is_premium', e.target.checked)}
                                            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500/50"
                                        />
                                        <label htmlFor="is_premium" className="text-sm text-slate-300 select-none cursor-pointer">
                                            Option Premium (Réservé aux membres)
                                        </label>
                                    </div>
                                </div>

                                {/* Bouton Secondaire */}
                                <div className="p-4 bg-slate-900 rounded-lg space-y-4 border border-slate-700">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Tirage Secondaire (Complexe)</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500 mr-2">{formState.btn_second_enabled ? 'Activé' : 'Désactivé'}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleChange('btn_second_enabled', !formState.btn_second_enabled)}
                                                className={clsx("w-10 h-5 rounded-full p-0.5 transition-colors relative", formState.btn_second_enabled ? "bg-blue-600" : "bg-slate-700")}
                                            >
                                                <div className={clsx("w-4 h-4 rounded-full bg-white shadow-sm transition-transform", formState.btn_second_enabled ? "translate-x-5" : "translate-x-0")} />
                                            </button>
                                        </div>
                                    </div>

                                    {formState.btn_second_enabled && (
                                        <div className="animate-in slide-in-from-top-2 duration-200">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs text-slate-500">Label</label>
                                                    <input
                                                        type="text"
                                                        value={formState.btn_second_label}
                                                        onChange={(e) => handleChange('btn_second_label', e.target.value)}
                                                        className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm text-white"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs text-slate-500 flex items-center gap-2">
                                                        Icône
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <div className="w-10 h-10 bg-slate-800 border border-slate-600 rounded flex items-center justify-center text-white">
                                                            <Icon icon={formState.btn_second_icon} width="20" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={formState.btn_second_icon}
                                                            onChange={(e) => handleChange('btn_second_icon', e.target.value)}
                                                            className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm text-white"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-4 pt-2 border-t border-slate-800">
                                                <input
                                                    type="checkbox"
                                                    id="btn_second_is_premium"
                                                    checked={formState.btn_second_is_premium}
                                                    onChange={(e) => handleChange('btn_second_is_premium', e.target.checked)}
                                                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500/50"
                                                />
                                                <label htmlFor="btn_second_is_premium" className="text-sm text-slate-300 select-none cursor-pointer">
                                                    Option Premium (Réservé aux membres)
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <h2 className="text-lg font-medium text-white border-b border-slate-700 pb-2 mb-4">Visuels</h2>
                                <div className="grid grid-cols-1 gap-6">
                                    {/* Thumbnail Image */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-300">Thumbnail Image</label>
                                        <div className="flex items-center gap-4 bg-slate-900 border border-slate-600 rounded-lg p-2">
                                            <div className="w-16 h-16 bg-slate-800 rounded flex-shrink-0 overflow-hidden border border-slate-700">
                                                {formState.image_url ? (
                                                    <img src={formState.image_url} className="w-full h-full object-cover" />
                                                ) : <div className="w-full h-full flex items-center justify-center text-slate-600"><Icon icon="mdi:image-off" /></div>}
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <input
                                                    type="text"
                                                    value={formState.image_url}
                                                    onChange={(e) => handleChange('image_url', e.target.value)}
                                                    placeholder="URL de l'image (ou charger un fichier)"
                                                    className="w-full bg-slate-800 border-b border-slate-700 px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
                                                />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const url = await handleUpload(file);
                                                            if (url) handleChange('image_url', url);
                                                        }
                                                    }}
                                                    className="w-full text-xs text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-600"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Background Image */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-300">Background Image (Optionnel)</label>
                                        <div className="flex items-center gap-4 bg-slate-900 border border-slate-600 rounded-lg p-2">
                                            <div className="w-16 h-16 bg-slate-800 rounded flex-shrink-0 overflow-hidden border border-slate-700">
                                                {formState.background_image_url ? (
                                                    <img src={formState.background_image_url} className="w-full h-full object-cover" />
                                                ) : <div className="w-full h-full flex items-center justify-center text-slate-600"><Icon icon="mdi:image-off" /></div>}
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <input
                                                    type="text"
                                                    value={formState.background_image_url}
                                                    onChange={(e) => handleChange('background_image_url', e.target.value)}
                                                    placeholder="URL de l'image (ou charger un fichier)"
                                                    className="w-full bg-slate-800 border-b border-slate-700 px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
                                                />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const url = await handleUpload(file);
                                                            if (url) handleChange('background_image_url', url);
                                                        }
                                                    }}
                                                    className="w-full text-xs text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-600"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB: DONNÉES (ITEMS) --- */}
                {activeTab === 'data' && (
                    <div className="animate-in fade-in duration-300 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Valeurs de tirage</h2>
                            <button
                                onClick={() => setIsAddingItem(true)}
                                className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-lg shadow-blue-900/20"
                            >
                                <Icon icon="mdi:plus" /> Ajouter une valeur
                            </button>
                        </div>

                        {/* DATA TABLE */}
                        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-900/50 text-slate-400 font-medium border-b border-slate-700">
                                    <tr>
                                        <th className="px-6 py-4 w-24">Image</th>
                                        <th className="px-6 py-4">Nom</th>
                                        <th className="px-6 py-4">Description</th>
                                        <th className="px-6 py-4 w-20 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50">
                                    {drawType.items?.sort((a, b) => a.name.localeCompare(b.name)).map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-700/30 transition-colors group">
                                            <td className="px-6 py-3">
                                                <div className="w-12 h-12 bg-slate-900 rounded border border-slate-700 overflow-hidden">
                                                    {item.image_url ? (
                                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : <div className="w-full h-full flex items-center justify-center text-slate-600"><Icon icon="mdi:image-off" /></div>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 font-medium text-white">
                                                <div>{item.name}</div>
                                                <div className="text-[10px] text-slate-500 font-mono">{item.slug}</div>
                                            </td>
                                            <td className="px-6 py-3 text-slate-300 max-w-sm">
                                                <div className="line-clamp-2 text-sm mb-1">
                                                    {item.long_description}
                                                </div>
                                                {item.reversed_description && (
                                                    <div className="mt-2 pt-2 border-t border-slate-700/50 flex gap-2">
                                                        <Icon icon="mdi:rotate-3d-variant" className="text-orange-400 shrink-0 mt-0.5" />
                                                        <span className="text-xs text-orange-300 italic line-clamp-2">
                                                            {item.reversed_description}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <button
                                                    onClick={() => setEditingItem(item)}
                                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                                >
                                                    <Icon icon="mdi:pencil" width="18" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!drawType.items || drawType.items.length === 0) && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
                                                Aucune donnée disponible. Commencez par en ajouter une.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* EDIT / ADD MODAL */}
                        {(isAddingItem || editingItem) && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                                <div className="bg-slate-800 rounded-xl border border-slate-600 shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                                    <form action={editingItem ? (fd) => handleUpdateItemInternal(editingItem.id, fd) : handleAddItem}>

                                        <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                                            <h3 className="text-lg font-bold text-white">
                                                {editingItem ? "Éditer la valeur" : "Nouvelle valeur"}
                                            </h3>
                                            <button type="button" onClick={() => { setIsAddingItem(false); setEditingItem(null); }} className="text-slate-400 hover:text-white"><Icon icon="mdi:close" width="24" /></button>
                                        </div>

                                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-slate-400 uppercase">Nom</label>
                                                    <input
                                                        name="item_name"
                                                        defaultValue={editingItem?.name}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            const slugInput = document.querySelector('input[name="item_slug"]') as HTMLInputElement;
                                                            if (slugInput && (!slugInput.value || slugInput.value === '')) {
                                                                slugInput.value = val.toLowerCase().trim()
                                                                    .replace(/[^\w\s-]/g, '')
                                                                    .replace(/[\s_-]+/g, '-')
                                                                    .replace(/^-+|-+$/g, '');
                                                            }
                                                        }}
                                                        className="w-full bg-slate-900 border-slate-600 rounded px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                                                        required
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-slate-400 uppercase">Slug</label>
                                                    <input
                                                        name="item_slug"
                                                        defaultValue={editingItem?.slug}
                                                        className="w-full bg-slate-900 border-slate-600 rounded px-3 py-2 text-sm text-slate-300 font-mono focus:ring-1 focus:ring-blue-500 outline-none"
                                                        placeholder="auto-généré"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-400 uppercase">Description Principale (Signification)</label>
                                                <textarea name="item_long_desc" defaultValue={editingItem?.long_description} rows={5} className="w-full bg-slate-900 border-slate-600 rounded px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none" required />
                                            </div>

                                            {/* Reversed Value Section */}
                                            <div className="pt-2">
                                                <ReversibleSection defaultReversed={editingItem?.reversed_description || ''} />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-400 uppercase">Image</label>
                                                <div className="flex gap-4">
                                                    <div className="flex-1 space-y-2">
                                                        <input
                                                            name="item_image"
                                                            value={itemImagePreview}
                                                            onChange={(e) => setItemImagePreview(e.target.value)}
                                                            className="w-full bg-slate-900 border-slate-600 rounded px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                                                            placeholder="URL de l'image"
                                                        />
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={async (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    const url = await handleUpload(file);
                                                                    if (url) setItemImagePreview(url);
                                                                }
                                                            }}
                                                            className="w-full text-xs text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-600"
                                                        />
                                                    </div>
                                                    <div className="w-20 h-20 bg-slate-900 border border-slate-600 rounded flex items-center justify-center shrink-0 overflow-hidden">
                                                        {itemImagePreview ? (
                                                            <img src={itemImagePreview} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Icon icon="mdi:image" className="text-slate-600" width="24" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="px-6 py-4 border-t border-slate-700 bg-slate-900/50 flex justify-between items-center">
                                            <div>
                                                {editingItem && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteItemInternal(editingItem.id)}
                                                        className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 px-3 py-2 hover:bg-red-500/10 rounded transition-colors"
                                                    >
                                                        <Icon icon="mdi:trash-can-outline" /> Supprimer
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => { setIsAddingItem(false); setEditingItem(null); }}
                                                    className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                                                >
                                                    Annuler
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium text-sm transition-colors shadow-lg shadow-blue-900/20"
                                                >
                                                    {editingItem ? "Enregistrer" : "Créer"}
                                                </button>
                                            </div>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )
                }
            </div >
        </div >
    );
}

function ReversibleSection({ defaultReversed }: { defaultReversed: string }) {
    const [isReversible, setIsReversible] = useState(!!defaultReversed);
    return (
        <div className="space-y-4 bg-slate-900/40 p-3 rounded border border-slate-700/50">
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="is_reversible"
                    checked={isReversible}
                    onChange={(e) => setIsReversible(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-orange-500 focus:ring-orange-500/50"
                />
                <label htmlFor="is_reversible" className="text-sm font-medium text-orange-200 select-none cursor-pointer flex items-center gap-2">
                    <Icon icon="mdi:rotate-3d-variant" /> Valeur inversable ?
                </label>
            </div>
            {isReversible && (
                <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
                    <label className="text-xs font-bold text-orange-400 uppercase">Description (Sens Inversé)</label>
                    <textarea
                        name="item_reversed_desc"
                        defaultValue={defaultReversed}
                        rows={3}
                        className="w-full bg-slate-800 border-orange-900/30 border rounded px-3 py-2 text-sm text-white focus:ring-1 focus:ring-orange-500 outline-none placeholder:text-slate-600"
                        placeholder="Signification si la carte/rune sort à l'envers..."
                    />
                </div>
            )}
        </div>
    );
}
