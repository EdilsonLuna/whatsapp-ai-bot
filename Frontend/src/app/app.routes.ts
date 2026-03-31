import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { PageNotFound } from './components/page-not-found/page-not-found';
import { Login } from './components/login/login';
import { authGuard } from './guards/auth.guard';
import { permissionGuard } from './guards/permission.guard';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';
import { PERMISSIONS } from './config/permissions';

export const routes: Routes = [
    {
        path: '',
        canActivate: [authGuard],
        component: Login,
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login,
        canActivate: [authGuard],
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard],
        children:[
            {
                path: 'create-conversation',
                loadComponent: () => import('./components/chats/create-chat/create-chat.component').then(c => c.CreateChatComponent)
            },
            {
                path: 'list-chats',
                loadComponent: () => import('./components/chats/list-chats/list-chats.component').then(c => c.ListChatsComponent),
                children: [
                    {
                        path: 'chat/:id',
                        loadComponent: () => import('./components/chats/list-chats/info-chat/info-chat.component').then(c => c.InfoChatComponent)
                    }
                ]
            },
            {
                path: 'products',
                loadComponent: () => import('./components/products/products.component').then(c => c.ProductsComponent)
            },
            {
                path: 'configuration',
                loadComponent: () => import('./components/configuration/configuration.component').then(c => c.ConfigurationComponent),
                canDeactivate: [unsavedChangesGuard]
            }
        ]
    },
    {
        path: '**',
        component: PageNotFound
    }
];
