import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

export const unsavedChangesGuard: CanDeactivateFn<ComponentCanDeactivate> = (component) => {
  if (component.canDeactivate && !component.canDeactivate()) {
    return confirm(
      '⚠️ Vas a salir del módulo y perderás los cambios. ¿Deseas continuar?'
    );
  }
  return true;
};
