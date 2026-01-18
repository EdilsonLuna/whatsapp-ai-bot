import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
    selector: 'app-side-bar',
    imports: [CommonModule],
    templateUrl: './side-bar.component.html',
    styleUrl: './side-bar.component.scss',
    standalone: true
})
export class SideBarComponent {
  @Output() sidebarStateChange = new EventEmitter<boolean>();

  constructor(private router:Router){

  }
  
  isCollapsed = false;

  menuItems: MenuItem[] = [
    {
      label: 'Crear Conversación',
      route: 'create-conversation',
      icon: 'bi-plus-circle' 
    },
    {
      label: 'Listar Conversaciones',
      route: 'list-chats',
      icon: 'bi-chat-dots'
    },
    {
      label: 'Productos',
      route: 'products',
      icon: 'bi bi-box'
    },
    {
      label: 'Configuración',
      route: 'configuration',
      icon: 'bi bi-gear'
    }
  ];

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.sidebarStateChange.emit(this.isCollapsed);
  }

  onClickModule(route:string){
    this.router.navigate(['/Dashboard/' + route])
  }
}
