import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

interface Message {
  id: number;
  conversation_id: number;
  sender: 'user' | 'assistant';
  message: string;
  prompt_sent: string | null;
  created_at: string;
}

interface ConversationHistoryResponse {
  success: boolean;
  data: Message[];
}

@Component({
  selector: 'app-info-chat',
  standalone: true,
  imports: [
    CommonModule 
  ],
  templateUrl: './info-chat.component.html',
  styleUrl: './info-chat.component.scss'
})
export class InfoChatComponent implements OnInit {
  conversationId: number = 0;
  messages: Message[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  selectedPrompt: string = '';

  private readonly API_BASE_URL = 'http://localhost:3000/api/conversations';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.conversationId = +params['id'];
      if (this.conversationId) {
        this.loadConversationHistory(this.conversationId);
      }
    });
  }

  loadConversationHistory(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.messages = [];

    const url = `${this.API_BASE_URL}/${id}/history`;

    this.http.get<ConversationHistoryResponse>(url).subscribe({
      next: (response) => {
        this.messages = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar historial:', error);
        this.errorMessage = 'Error al cargar el historial de la conversación.';
        this.isLoading = false;
      }
    });
  }

  openPromptModal(prompt: string): void {
    this.selectedPrompt = prompt;
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  isUserMessage(message: Message): boolean {
    return message.sender === 'user';
  }

  isAssistantMessage(message: Message): boolean {
    return message.sender === 'assistant';
  }
}
