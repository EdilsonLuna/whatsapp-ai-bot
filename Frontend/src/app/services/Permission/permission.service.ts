import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private permissions = new Set<string>();

  setPermissions(perms: string[]): void {
    this.permissions = new Set(perms);
  }

  has(permission: string): boolean {
    return this.permissions.has(permission);
  }

  clear(): void {
    this.permissions.clear();
  }
}
