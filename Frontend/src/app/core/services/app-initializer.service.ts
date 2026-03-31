import { Injectable, inject } from '@angular/core';
import { Auth } from '../../services/Auth/auth';
import { PermissionService } from '../../services/Permission/permission.service';
import { AppInitState } from '../state/app-init.state';

@Injectable({ providedIn: 'root' })
export class AppInitializerService {
  private readonly auth = inject(Auth);
  private readonly permissionService = inject(PermissionService);
  private readonly state = inject(AppInitState);

  /**
   * Punto único de inicialización de la app.
   * Se llama desde provideAppInitializer (startup) y desde login.
   */
  async init(token: string): Promise<void> {
    this.state.setLoading();

    try {
      this.auth.setToken(token);
      this.setUserPermissions();
      await this.loadInitialData();
      await this.otherInitTasks();
      this.state.setInitialized();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error inicializando la aplicación';
      this.state.setError(message);
      this.auth.clearSession();
      throw err;
    }
  }

  /** Decodifica el token y carga permisos en PermissionService. */
  private setUserPermissions(): void {
    this.auth.loadPermissions();
  }

  /** Placeholder: carga datos iniciales desde API (catálogos, config, etc.). */
  private async loadInitialData(): Promise<void> {
    // Ejemplo futuro:
    // const catalogos = await firstValueFrom(this.catalogoService.getAll());
  }

  /** Placeholder: otras tareas de inicialización. */
  private async otherInitTasks(): Promise<void> {
    // Ejemplo futuro:
    // await this.analyticsService.init();
  }

  /** Limpia estado y sesión (para logout). */
  reset(): void {
    this.auth.clearSession();
    this.state.reset();
  }
}
