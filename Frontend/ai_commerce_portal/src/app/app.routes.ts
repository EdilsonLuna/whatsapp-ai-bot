import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: 'Dashboard',
        component: DashboardComponent
    },
    {
        path: 'create-conversation',
        component: DashboardComponent
    },
    {
        path: 'list-conversations',
        component: DashboardComponent
    }
];
