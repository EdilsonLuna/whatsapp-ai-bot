import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { NavService } from '../../../services/Nav/nav.service';
import { NavItem } from '../../../models/nav-item.model';

@Component({
  selector: 'app-panel-top',
  imports: [MatIcon],
  templateUrl: './panel-top.html',
  styleUrl: './panel-top.scss'
})
export class PanelTop implements OnInit, OnDestroy {
  currentModule = 'Dashboard';
  private routerSub!: Subscription;

  private readonly router = inject(Router);
  private readonly navService = inject(NavService);

  ngOnInit(): void {
    this.currentModule = this.resolveLabel(this.router.url);
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(e => {
        this.currentModule = this.resolveLabel((e as NavigationEnd).urlAfterRedirects);
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  private resolveLabel(url: string): string {
    const flat = this.flatten(this.navService.getMenuItems());
    const segment = '/' + url.split('/').filter(Boolean).pop();
    return flat.find(i => i.route === segment)?.module_name ?? 'Dashboard';
  }

  private flatten(items: NavItem[]): NavItem[] {
    return items.flatMap(i => i.children ? this.flatten(i.children) : [i]);
  }
}
