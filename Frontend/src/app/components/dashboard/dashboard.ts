import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelLeft } from './panel-left/panel-left';
import { PanelTop } from './panel-top/panel-top';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, PanelLeft, PanelTop, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

}
