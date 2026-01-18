export interface Settings {
    id: number;
    company_name: string;
    system_prompt: string;
    answer_type_id: number;
    welcome_message: string | null;
    fallback_message: string | null;
    business_hours_enabled: boolean;
    business_hours_json: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface AnswerType {
    id: number;
    type_name: string;
    description: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface SettingsWithAnswerType extends Settings {
    answer_type_name?: string;
    answer_type_description?: string;
}

export interface UpdateSettingsDTO {
    company_name?: string;
    system_prompt?: string;
    answer_type_id?: number;
    welcome_message?: string | null;
    fallback_message?: string | null;
    business_hours_enabled?: boolean;
    business_hours_json?: string | null;
}

export interface BusinessHours {
    [day: string]: {
        enabled: boolean;
        open?: string;
        close?: string;
    };
}
