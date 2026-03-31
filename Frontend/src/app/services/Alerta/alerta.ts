import { Injectable, signal } from '@angular/core';

export interface AlertaConfig {
  mensaje: string;
  tipo: 'success' | 'danger' | 'warning' | 'info';
  visible: boolean;
}

@Injectable({ providedIn: 'root' })
export class AlertaService {
  readonly alerta = signal<AlertaConfig>({ mensaje: '', tipo: 'danger', visible: false });

  mostrar(mensaje: string, tipo: 'success' | 'danger' | 'warning' | 'info' = 'danger') {
    this.alerta.set({ mensaje, tipo, visible: true });
  }

  cerrar() {
    this.alerta.update(a => ({ ...a, visible: false }));
  }
}
