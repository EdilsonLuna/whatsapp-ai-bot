import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertaComponent } from './components/alerta/alerta';
import { AppInitState } from './core/state/app-init.state';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertaComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('La piña de oro');
  protected readonly appInitState = inject(AppInitState);
}
