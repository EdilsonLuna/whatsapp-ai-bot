import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { NavService } from '../../../services/Nav/nav.service';
import { NavItem } from '../../../models/nav-item.model';
import { AppInitializerService } from '../../../core/services/app-initializer.service';

@Component({
  selector: 'app-panel-left',
  imports: [MatIcon],
  templateUrl: './panel-left.html',
  styleUrl: './panel-left.scss',
})
export class PanelLeft implements OnInit, OnDestroy {
  private router         = inject(Router);
  private navService     = inject(NavService);
  private appInitializer = inject(AppInitializerService);

  nombreEmpresa = 'LA PIÑA DE ORO';
  menuItems: NavItem[] = this.navService.getMenuItems();

  private expandedItems = signal<Set<string>>(new Set());
  private routerSub!: Subscription;

  isMenuOpen    = signal(false);
  currentModule = signal('Dashboard');

  ngOnInit(): void {
    this.currentModule.set(this.resolveLabel(this.router.url));
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(e => {
        this.currentModule.set(this.resolveLabel((e as NavigationEnd).urlAfterRedirects));
        this.isMenuOpen.set(false); // cerrar drawer al navegar
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  private resolveLabel(url: string): string {
    const flat    = this.flatten(this.navService.getMenuItems());
    const segment = '/' + url.split('/').filter(Boolean).pop();
    return flat.find(i => i.route === segment)?.module_name ?? 'Dashboard';
  }

  private flatten(items: NavItem[]): NavItem[] {
    return items.flatMap(i => i.children ? this.flatten(i.children) : [i]);
  }

  isExpanded(moduleName: string): boolean {
    return this.expandedItems().has(moduleName);
  }

  toggleExpand(moduleName: string): void {
    const current = new Set(this.expandedItems());
    current.has(moduleName) ? current.delete(moduleName) : current.add(moduleName);
    this.expandedItems.set(current);
  }

  toggleMenu(): void {
    this.isMenuOpen.update(v => !v);
  }

  navegarA(route: string): void {
    this.router.navigate(['/dashboard' + route]);
  }

  cerrarSesion(): void {
    this.appInitializer.reset();
    this.router.navigate(['/login']);
  }
}

