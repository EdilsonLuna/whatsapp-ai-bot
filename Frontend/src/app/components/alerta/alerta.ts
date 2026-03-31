import { Component, inject } from '@angular/core';
import { AlertaService } from '../../services/Alerta/alerta';

@Component({
  selector: 'app-alerta',
  standalone: true,
  templateUrl: './alerta.html',
  styleUrl: './alerta.scss'
})
export class AlertaComponent {
  private alertaService = inject(AlertaService);
  alerta = this.alertaService.alerta;

  cerrar() {
    this.alertaService.cerrar();
  }
}
