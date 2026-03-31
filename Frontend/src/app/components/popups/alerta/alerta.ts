import { Component,ChangeDetectionStrategy,Inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alerta',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './alerta.html',
  styleUrl: './alerta.scss'
})
export class Alerta {
  constructor(@Inject(MAT_DIALOG_DATA) public data: 
  { 
    title:string
    texto: string 
    btnAceptar:boolean
    btnCancelar:boolean
  }) {
    console.log(data);
  }
}
