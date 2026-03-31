import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Auth } from '../../services/Auth/auth';
import { AppInitializerService } from '../../core/services/app-initializer.service';
import { Router } from '@angular/router';
import { env } from '../../../environments/environment';
import { AlertaService } from '../../services/Alerta/alerta';

@Component({
  selector: 'app-login',
  imports: [MatIcon, CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private formBuilder = inject(FormBuilder);
  private auth = inject(Auth);
  private appInitializer = inject(AppInitializerService);
  private router = inject(Router);
  private alerta = inject(AlertaService);

  formDataUsuario: FormGroup = this.formBuilder.group({
    usuario: ['', []],
    contrasena: ['', []]
  });
  nombreEmpresa: string = env.NOMBRE_EMPRESA;
  emblemaEmpresa: string = env.EMBLEMA_EMPRESA;

  iniciarSesion() {
    if (this.formDataUsuario.valid) {
      this.auth.iniciarSesion(this.formDataUsuario.value).subscribe({
        next: (data) => {
          this.appInitializer.init(data.access_token).then(() => {
            this.router.navigate(['/dashboard']);
          }).catch(() => {
            this.alerta.mostrar('Error inicializando la aplicación. Intente nuevamente.');
          });
        },
        error: (error) => {
          console.error(error);
          if (error.status == 401) {
            this.alerta.mostrar('Usuario o Contraseña incorrectos.');
          } else {
            this.alerta.mostrar('Error realizando inicio de sesión. Intente nuevamente.');
          }
        }
      });
    }
  }
}
