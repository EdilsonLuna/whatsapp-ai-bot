import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Message {
  text: string;
  isUser: boolean;
  prompt?: string;
  conversationId?: number;
  timestamp: Date;
}

interface ApiResponse {
  success: boolean;
  message: string;
  prompt: string;
  conversationId: number;
}

@Component({
    selector: 'app-create-chat',
    imports: [
        CommonModule,
        FormsModule
    ],
    templateUrl: './create-chat.component.html',
    styleUrl: './create-chat.component.scss',
    standalone: true
})
export class CreateChatComponent implements OnInit {
  messages: Message[] = [];
  userInput: string = '';
  isLoading: boolean = false;
  phoneNumber: string = '';
  selectedPrompt: string = '';
  
  private readonly API_URL = 'http://localhost:3000/api/pruebaOpenAI';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.phoneNumber = this.generatePhoneNumber();
  }

  generatePhoneNumber(): string {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }

  sendMessage(): void {
    if (!this.userInput.trim() || this.isLoading) {
      return;
    }

    const userMessage: Message = {
      text: this.userInput,
      isUser: true,
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    const messageText = this.userInput;
    this.userInput = '';
    this.isLoading = true;

    const requestBody = this.buildRequestBody(messageText);

    this.http.post<ApiResponse>(this.API_URL, requestBody).subscribe({
      next: (response) => {
        const aiMessage: Message = {
          text: response.message,
          isUser: false,
          prompt: response.prompt,
          conversationId: response.conversationId,
          timestamp: new Date()
        };
        this.messages.push(aiMessage);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al enviar mensaje:', error);
        const errorMessage: Message = {
          text: 'Error al obtener respuesta. Por favor, intenta nuevamente.',
          isUser: false,
          timestamp: new Date()
        };
        this.messages.push(errorMessage);
        this.isLoading = false;
      }
    });
  }

  buildRequestBody(messageText: string): any {
    return {
      field: 'messages',
      value: {
        messaging_product: 'whatsapp',
        metadata: {
          display_phone_number: '16505551111',
          phone_number_id: '123456123'
        },
        contacts: [
          {
            profile: {
              name: 'test user name'
            },
            wa_id: this.phoneNumber
          }
        ],
        messages: [
          {
            from: this.phoneNumber,
            id: 'ABGGFlA5Fpa',
            timestamp: '1504902988',
            type: 'text',
            text: {
              body: messageText
            }
          }
        ]
      }
    };
  }

  openPromptModal(prompt: string): void {
    this.selectedPrompt = prompt;
  }

  getUserMessages(): Message[] {
    return this.messages.filter(m => m.isUser);
  }

  getAiMessages(): Message[] {
    return this.messages.filter(m => !m.isUser);
  }
}
