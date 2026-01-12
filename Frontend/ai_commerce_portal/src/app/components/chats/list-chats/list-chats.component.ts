import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

interface LastMessage {
  id: number;
  sender: string;
  message: string;
  created_at: string;
}

interface Conversation {
  id: number;
  user_phone: string;
  started_at: string;
  last_message_at: string;
  is_active: number;
  last_message: LastMessage;
}

interface ConversationsResponse {
  success: boolean;
  data: Conversation[];
}

@Component({
  selector: 'app-list-chats',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './list-chats.component.html',
  styleUrl: './list-chats.component.scss'
})
export class ListChatsComponent implements OnInit {
  conversations: Conversation[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  private readonly API_URL = 'http://localhost:3000/api/conversations';

  constructor(
    private http: HttpClient,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadConversations();
  }

  loadConversations(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<ConversationsResponse>(this.API_URL).subscribe({
      next: (response) => {
        this.conversations = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar conversaciones:', error);
        this.errorMessage = 'Error al cargar las conversaciones. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  openConversation(conversationId: number): void {
    this.router.navigate(['/Dashboard/list-chats/chat', conversationId]);
  }

  truncateMessage(message: string, maxLength: number = 40): string {
    if (message.length <= maxLength) {
      return message;
    }
    return message.substring(0, maxLength) + '...';
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  refreshConversations(): void {
    this.loadConversations();
  }
}
