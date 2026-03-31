import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  imports: [MatIcon],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.scss'
})
export class PageNotFound {
  constructor(private router:Router){}
    irAInicio(){
      this.router.navigate(['/dashboard']);
  }
}
