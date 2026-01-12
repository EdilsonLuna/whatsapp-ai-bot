import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import path from 'path';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'Dashboard',
        pathMatch: 'full'
    },
    {
        path: 'Dashboard',
        component: DashboardComponent,
        children: [
            {
                path: 'create-conversation',
                loadComponent: () => import('./components/chats/create-chat/create-chat.component').then(c=>c.CreateChatComponent)
            }
        ]
    }
];
