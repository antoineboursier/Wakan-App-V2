export interface DrawType {
    id: string;
    slug: string;
    title: string;
    description?: string | null;
    image_url?: string | null;
    background_image_url?: string | null;
    intro_title?: string | null;
    intro_subtitle?: string | null;

    btn_main_label?: string | null;
    btn_main_icon?: string | null;
    btn_second_label?: string | null;
    btn_second_icon?: string | null;
    btn_second_enabled?: boolean;
    is_premium?: boolean;
    btn_second_is_premium?: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    positions?: DrawPosition[];
    items?: DrawItem[];
}

export interface DrawPosition {
    id: string;
    draw_type_id: string;
    position_index: number;
    name: string;
    description?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DrawItem {
    id: string;
    draw_type_id: string;
    slug: string;
    name: string;
    image_url?: string | null;
    long_description: string;
    short_description?: string | null;
    reversed_description?: string | null;
    keywords?: string[] | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type DrawTypeFormData = {
    slug: string;
    title: string;
    description?: string;
    image_url?: string;
    background_image_url?: string;
    intro_title?: string;
    intro_subtitle?: string;
    btn_main_label?: string;
    btn_main_icon?: string;
    btn_second_label?: string;
    btn_second_icon?: string;
    btn_second_enabled?: boolean;
    is_premium?: boolean;
    btn_second_is_premium?: boolean;
    is_active: boolean;
};

export type DrawItemFormData = {
    slug: string;
    name: string;
    image_url?: string;
    long_description?: string;
    reversed_description?: string;
    is_active: boolean;
};

export type DrawPositionFormData = {
    name: string;
    description?: string;
    position_index: number;
};
