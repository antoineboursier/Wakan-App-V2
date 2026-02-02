'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Icon } from '@iconify/react';
import { useEffect } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    rows?: number;
    className?: string;
}

// Couleurs utilisant les variables CSS du Design System
// Ces valeurs seront interprétées par le navigateur au runtime
const COLOR_OPTIONS = [
    {
        id: 'accent',
        label: 'Accent',
        // Valeur CSS variable pour le front, fallback hex pour le BO
        cssVar: 'var(--accent-900, #f6ae31)',
        // Couleur de preview pour le BO (approximation visuelle)
        previewColor: '#f6ae31',
        icon: 'mdi:format-color-highlight'
    },
    {
        id: 'secondary',
        label: 'Info secondaire',
        cssVar: 'var(--text-secondary, #cdbcae)',
        previewColor: '#cdbcae',
        icon: 'mdi:format-color-text'
    },
];

/**
 * Éditeur WYSIWYG léger basé sur TipTap
 * Fonctionnalités: Gras, Italique, Listes, Couleurs (Accent, Secondary)
 * Output: HTML avec variables CSS pour les couleurs
 */
export function RichTextEditor({
    value,
    onChange,
    placeholder = "Écrivez ici...",
    rows = 4,
    className = ""
}: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: false,
                codeBlock: false,
                code: false,
                blockquote: false,
                horizontalRule: false,
            }),
            Placeholder.configure({
                placeholder,
            }),
            TextStyle,
            Color,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-sm max-w-none focus:outline-none min-h-full',
            },
        },
    });

    // Sync external value changes
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!editor) {
        return null;
    }

    const minHeight = rows * 24;

    // Vérifie si une couleur est active
    const getActiveColor = () => {
        for (const color of COLOR_OPTIONS) {
            if (editor.isActive('textStyle', { color: color.cssVar })) {
                return color.id;
            }
        }
        return null;
    };

    const activeColor = getActiveColor();

    return (
        <div className={`rounded border border-slate-700 bg-slate-900 overflow-hidden ${className}`}>
            {/* Toolbar */}
            <div className="flex items-center gap-1 px-2 py-1.5 bg-slate-800 border-b border-slate-700 flex-wrap">
                <ToolbarButton
                    icon="mdi:format-bold"
                    label="Gras"
                    isActive={editor.isActive('bold')}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                />
                <ToolbarButton
                    icon="mdi:format-italic"
                    label="Italique"
                    isActive={editor.isActive('italic')}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                />

                <div className="w-px h-5 bg-slate-600 mx-1" />

                <ToolbarButton
                    icon="mdi:format-list-bulleted"
                    label="Liste à puces"
                    isActive={editor.isActive('bulletList')}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                />
                <ToolbarButton
                    icon="mdi:format-list-numbered"
                    label="Liste numérotée"
                    isActive={editor.isActive('orderedList')}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                />

                <div className="w-px h-5 bg-slate-600 mx-1" />

                {/* Color Buttons */}
                {COLOR_OPTIONS.map((color) => (
                    <ColorButton
                        key={color.id}
                        color={color}
                        isActive={activeColor === color.id}
                        onClick={() => {
                            if (activeColor === color.id) {
                                // Si déjà actif, retirer la couleur
                                editor.chain().focus().unsetColor().run();
                            } else {
                                // Appliquer la couleur
                                editor.chain().focus().setColor(color.cssVar).run();
                            }
                        }}
                    />
                ))}

                {/* Clear Color */}
                {activeColor && (
                    <ToolbarButton
                        icon="mdi:format-color-marker-cancel"
                        label="Retirer la couleur"
                        onClick={() => editor.chain().focus().unsetColor().run()}
                    />
                )}

                <div className="w-px h-5 bg-slate-600 mx-1" />

                <ToolbarButton
                    icon="mdi:undo"
                    label="Annuler"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                />
                <ToolbarButton
                    icon="mdi:redo"
                    label="Rétablir"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                />
            </div>

            {/* Editor Content */}
            <div
                className="px-3 py-2 text-white text-sm"
                style={{ minHeight: `${minHeight}px` }}
            >
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}

interface ToolbarButtonProps {
    icon: string;
    label: string;
    isActive?: boolean;
    onClick: () => void;
    disabled?: boolean;
}

function ToolbarButton({ icon, label, isActive, onClick, disabled }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={label}
            className={`
                p-1.5 rounded transition-colors
                ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            <Icon icon={icon} width={18} />
        </button>
    );
}

interface ColorButtonProps {
    color: typeof COLOR_OPTIONS[0];
    isActive: boolean;
    onClick: () => void;
}

function ColorButton({ color, isActive, onClick }: ColorButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={color.label}
            className={`
                p-1.5 rounded transition-colors flex items-center gap-1
                ${isActive
                    ? 'bg-slate-600 ring-2 ring-offset-1 ring-offset-slate-800'
                    : 'hover:bg-slate-700'
                }
            `}
            style={{
                // Ring color matches the color option
                '--tw-ring-color': color.previewColor
            } as React.CSSProperties}
        >
            {/* Color indicator dot */}
            <span
                className="w-4 h-4 rounded-full border border-slate-500"
                style={{ backgroundColor: color.previewColor }}
            />
            <span className="text-xs text-slate-400 hidden sm:inline">{color.label}</span>
        </button>
    );
}
