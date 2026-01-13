import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";

@Component({
    selector: 'app-dashboard',
    imports: [
        CommonModule,
        RouterModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    standalone: true
})
export class DashboardComponent {

}
