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
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  @Output() sidebarStateChange = new EventEmitter<boolean>();
  
  isCollapsed = false;

  menuItems: MenuItem[] = [
    {
      label: 'Crear Conversación',
      route: '/create-conversation',
      icon: 'bi-plus-circle'
    },
    {
      label: 'Listar Conversaciones',
      route: '/list-conversations',
      icon: 'bi-chat-dots'
    }
  ];

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.sidebarStateChange.emit(this.isCollapsed);
  }
}
