export interface Quiz {
    id: string;
    slug: string;
    title: string;
    short_title?: string | null;
    description?: string | null;
    long_description?: string | null;
    is_active: boolean;
    type: 'personality';
    result_display_type?: 'single' | 'multiple';
    // New fields
    image_url?: string | null;
    background_image_url?: string | null;
    is_premium?: boolean;
    limit_enabled?: boolean;
    limit_count?: number;
    // Display options
    published_at?: string | null;
    btn_label?: string | null;
    btn_icon?: string | null;
    created_at: string;
    updated_at: string;
}

export interface QuizProfile {
    id: string;
    quiz_id: string;
    name: string;
    description_result?: string | null;
    image_url?: string | null;
    is_active: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface QuizQuestion {
    id: string;
    quiz_id: string;
    question_text: string;
    order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    // Relations (optionnelles pour le chargement eager)
    answers?: QuizAnswer[];
}

export interface QuizAnswer {
    id: string;
    question_id: string;
    answer_text: string;
    order: number;
    created_at: string;
    updated_at: string;
    // Relations
    influences?: QuizAnswerInfluence[];
}

export interface QuizAnswerInfluence {
    id: string;
    answer_id: string;
    profile_id: string;
    weight: number;
    created_at: string;
}

// --- Form Data Types ---

export type QuizFormData = {
    slug: string;
    title: string;
    short_title?: string;
    description?: string;
    long_description?: string;
    is_active: boolean;
    result_display_type?: 'single' | 'multiple';
    image_url?: string;
    background_image_url?: string;
    is_premium?: boolean;
    limit_enabled?: boolean;
    limit_count?: number;
    published_at?: string | null;
    btn_label?: string | null;
    btn_icon?: string | null;
};

export type QuizProfileFormData = {
    name: string;
    description_result?: string;
    image_url?: string;
    is_active: boolean;
    order: number;
};

export type QuizQuestionFormData = {
    question_text: string;
    order: number;
    is_active: boolean;
};

export type QuizAnswerFormData = {
    answer_text: string;
    order: number;
};

export type QuizAnswerInfluenceFormData = {
    profile_id: string;
    weight: number;
};
