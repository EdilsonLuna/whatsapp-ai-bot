import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import path from 'path';
import { ProductsComponent } from './components/products/products.component';

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
            },
            {
                path: 'list-chats',
                loadComponent: () => import('./components/chats/list-chats/list-chats.component').then(c=>c.ListChatsComponent),
                children: [
                    {
                        path: 'chat/:id',
                        loadComponent : () => import('./components/chats/list-chats/info-chat/info-chat.component').then(c=>c.InfoChatComponent)
                    }
                ]
            },
            {
                path: 'products',
                component: ProductsComponent
            }
        ]
    }
];
