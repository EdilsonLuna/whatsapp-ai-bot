// ============================================
// Interfaces de Settings
// ============================================

export interface SettingsData {
  id: number;
  company_name: string;
  system_prompt: string;
  answer_type_id: number;
  welcome_message: string | null;
  fallback_message: string | null;
  business_hours_enabled: boolean;
  business_hours_json: string | null;
  created_at: string;
  updated_at: string;
  answer_type_name?: string;
  answer_type_description?: string;
}

export interface SettingsResponse {
  success: boolean;
  data: SettingsData;
}

// ============================================
// Interfaces de Answer Types
// ============================================

export interface AnswerType {
  id: number;
  type_name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnswerTypesResponse {
  success: boolean;
  data: AnswerType[];
  total: number;
}

// ============================================
// Interfaces de Business Hours
// ============================================

export interface BusinessHourDay {
  enabled: boolean;
  open?: string;
  close?: string;
}

export interface BusinessHours {
  [day: string]: BusinessHourDay;
}

// ============================================
// DTOs
// ============================================

export interface UpdateSettingsPayload {
  company_name?: string;
  system_prompt?: string;
  answer_type_id?: number;
  welcome_message?: string;
  fallback_message?: string;
  business_hours_enabled?: boolean;
  business_hours_json?: string;
}

export interface UpdateSettingsResponse {
  success: boolean;
  message: string;
  data: SettingsData;
}

// ============================================
// Constantes
// ============================================

export const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' }
];
