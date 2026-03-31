import { Injectable, computed, signal } from '@angular/core';

export interface AppInitStateModel {
  loading: boolean;
  initialized: boolean;
  error: string | null;
}

const INITIAL_STATE: AppInitStateModel = {
  loading: false,
  initialized: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class AppInitState {
  private readonly _state = signal<AppInitStateModel>(INITIAL_STATE);

  readonly state = this._state.asReadonly();
  readonly loading = computed(() => this._state().loading);
  readonly initialized = computed(() => this._state().initialized);
  readonly error = computed(() => this._state().error);

  setLoading(): void {
    this._state.set({ loading: true, initialized: false, error: null });
  }

  setInitialized(): void {
    this._state.set({ loading: false, initialized: true, error: null });
  }

  setError(error: string): void {
    this._state.set({ loading: false, initialized: false, error });
  }

  reset(): void {
    this._state.set(INITIAL_STATE);
  }
}
