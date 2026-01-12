// ============================================
// Interfaces para Base de Datos
// ============================================

export interface Conversation {
  id: number;
  user_phone: string;
  started_at: Date;
  last_message_at: Date;
  is_active: boolean;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender: 'user' | 'assistant';
  message: string;
  prompt_sent: string | null;
  created_at: Date;
}

// ============================================
// Interfaces para Webhook de WhatsApp
// ============================================

export interface WhatsAppWebhookMessage {
  field: string;
  value: WhatsAppWebhookValue;
}

export interface WhatsAppWebhookValue {
  messaging_product: string;
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
  contacts: Array<{
    profile: {
      name: string;
    };
    wa_id: string;
  }>;
  messages: Array<{
    from: string;
    id: string;
    timestamp: string;
    type: string;
    text: {
      body: string;
    };
  }>;
}

// ============================================
// DTOs para operaciones
// ============================================

export interface CreateConversationDTO {
  user_phone: string;
}

export interface CreateMessageDTO {
  conversation_id: number;
  sender: 'user' | 'assistant';
  message: string;
  prompt_sent?: string | null;
}

export interface UpdateConversationDTO {
  last_message_at?: Date;
  is_active?: boolean;
}
