import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-agregar-intereses',
  imports: [MatDialogModule, MatButtonModule, MatIcon],
  templateUrl: './agregar-intereses.html',
  styleUrl: './agregar-intereses.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgregarIntereses {

  cerrar(){

  }

  guardar(){

  }
}
