import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
    selector: 'app-side-bar',
    imports: [CommonModule, RouterModule],
    templateUrl: './side-bar.component.html',
    styleUrl: './side-bar.component.scss',
    standalone: true
})
export class SideBarComponent {
  @Output() sidebarStateChange = new EventEmitter<boolean>();
  
  isCollapsed = false;

  menuItems: MenuItem[] = [
    {
      label: 'Crear Conversación',
      route: '/Dashboard/create-conversation',
      icon: 'bi-plus-circle' 
    },
    {
      label: 'Listar Conversaciones',
      route: '/Dashboard/list-chats',
      icon: 'bi-chat-dots'
    },
    {
      label: 'Productos',
      route: '/Dashboard/products',
      icon: 'bi bi-box'
    }
  ];

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.sidebarStateChange.emit(this.isCollapsed);
  }
}
