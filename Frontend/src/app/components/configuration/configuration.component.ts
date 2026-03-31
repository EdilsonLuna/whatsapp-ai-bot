import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { SettingsService } from '../../services/Settings/settings.service';
import {
  SettingsData,
  AnswerType,
  BusinessHours,
  UpdateSettingsPayload,
  DAYS_OF_WEEK
} from './model/settings.model';
import { ComponentCanDeactivate } from '../../guards/unsaved-changes.guard';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss'
})
export class ConfigurationComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  configForm!: FormGroup;
  answerTypes: AnswerType[] = [];
  daysOfWeek = DAYS_OF_WEEK;
  
  isLoading = false;
  isSaving = false;
  loadError = false;
  
  successMessage = '';
  errorMessage = '';
  
  private originalFormValue: any;

  // Límites de caracteres
  readonly CHAR_LIMITS = {
    system_prompt: 300,
    welcome_message: 100,
    fallback_message: 100
  };

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadData();
    this.setupBeforeUnload();
  }

  ngOnDestroy(): void {
    this.removeBeforeUnload();
  }

  canDeactivate(): boolean {
    if (this.hasUnsavedChanges()) {
      return false;
    }
    return true;
  }

  hasUnsavedChanges(): boolean {
    if (!this.originalFormValue) return false;
    return JSON.stringify(this.configForm.value) !== JSON.stringify(this.originalFormValue);
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (this.hasUnsavedChanges()) {
      $event.returnValue = true;
    }
  }

  private setupBeforeUnload(): void {}

  private removeBeforeUnload(): void {}

  private initializeForm(): void {
    this.configForm = this.fb.group({
      company_name: ['', [Validators.required]],
      system_prompt: ['', [Validators.required, Validators.maxLength(this.CHAR_LIMITS.system_prompt)]],
      answer_type_id: [null, [Validators.required]],
      welcome_message: ['', [Validators.required, Validators.maxLength(this.CHAR_LIMITS.welcome_message)]],
      fallback_message: ['', [Validators.required, Validators.maxLength(this.CHAR_LIMITS.fallback_message)]],
      business_hours_enabled: [false],
      business_hours: this.fb.array([])
    });
  }

  get businessHoursArray(): FormArray {
    return this.configForm.get('business_hours') as FormArray;
  }

  private loadData(): void {
    this.isLoading = true;
    this.loadError = false;

    forkJoin({
      settings: this.settingsService.getSettings(),
      answerTypes: this.settingsService.getAnswerTypes()
    }).subscribe({
      next: (response) => {
        this.answerTypes = response.answerTypes.data;
        this.populateForm(response.settings.data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando datos:', error);
        this.loadError = true;
        this.errorMessage = 'Error al cargar la configuración. Por favor, recarga la página.';
        this.isLoading = false;
      }
    });
  }

  private populateForm(data: SettingsData): void {
    this.configForm.patchValue({
      company_name: data.company_name,
      system_prompt: data.system_prompt,
      answer_type_id: data.answer_type_id,
      welcome_message: data.welcome_message || '',
      fallback_message: data.fallback_message || '',
      business_hours_enabled: data.business_hours_enabled
    });

    if (data.business_hours_json) {
      try {
        const businessHours: BusinessHours = JSON.parse(data.business_hours_json);
        this.loadBusinessHours(businessHours);
      } catch (error) {
        console.error('Error parseando business_hours_json:', error);
      }
    }

    this.originalFormValue = this.configForm.value;
  }

  private loadBusinessHours(businessHours: BusinessHours): void {
    this.businessHoursArray.clear();
    
    Object.keys(businessHours).forEach(dayKey => {
      const dayData = businessHours[dayKey];
      this.businessHoursArray.push(this.createBusinessHourGroup(dayKey, dayData));
    });
  }

  private createBusinessHourGroup(dayKey: string, data?: any): FormGroup {
    return this.fb.group({
      day: [dayKey, Validators.required],
      enabled: [data?.enabled || false],
      open: [data?.open || '09:00'],
      close: [data?.close || '18:00']
    });
  }

  addBusinessHour(): void {
    const usedDays = this.businessHoursArray.value.map((bh: any) => bh.day);
    const availableDays = this.daysOfWeek.filter(d => !usedDays.includes(d.key));
    
    if (availableDays.length === 0) {
      alert('Ya has agregado todos los días de la semana');
      return;
    }

    this.businessHoursArray.push(this.createBusinessHourGroup(availableDays[0].key));
  }

  removeBusinessHour(index: number): void {
    if (confirm('¿Estás seguro de eliminar este horario?')) {
      this.businessHoursArray.removeAt(index);
    }
  }

  getDayLabel(dayKey: string): string {
    const day = this.daysOfWeek.find(d => d.key === dayKey);
    return day ? day.label : dayKey;
  }

  getAvailableDays(currentDay?: string): typeof DAYS_OF_WEEK {
    const usedDays = this.businessHoursArray.value
      .map((bh: any) => bh.day)
      .filter((day: string) => day !== currentDay);
    
    return this.daysOfWeek.filter(d => !usedDays.includes(d.key));
  }

  getCharCount(controlName: string): number {
    const value = this.configForm.get(controlName)?.value || '';
    return value.length;
  }

  getCharLimit(controlName: string): number {
    return this.CHAR_LIMITS[controlName as keyof typeof this.CHAR_LIMITS] || 0;
  }

  getProgressClass(controlName: string): string {
    const count = this.getCharCount(controlName);
    const limit = this.getCharLimit(controlName);
    const percentage = (count / limit) * 100;

    if (percentage >= 90) return 'text-danger';
    if (percentage >= 70) return 'text-warning';
    return 'text-muted';
  }

  onSubmit(): void {
    if (this.configForm.invalid) {
      this.markFormGroupTouched(this.configForm);
      this.errorMessage = 'Por favor, completa todos los campos requeridos correctamente.';
      setTimeout(() => this.errorMessage = '', 5000);
      return;
    }

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formValue = this.configForm.value;
    
    const businessHoursJson = this.buildBusinessHoursJson(formValue.business_hours);

    const payload: UpdateSettingsPayload = {
      company_name: formValue.company_name,
      system_prompt: formValue.system_prompt,
      answer_type_id: formValue.answer_type_id,
      welcome_message: formValue.welcome_message,
      fallback_message: formValue.fallback_message,
      business_hours_enabled: formValue.business_hours_enabled,
      business_hours_json: businessHoursJson
    };

    this.settingsService.updateSettings(payload).subscribe({
      next: (response) => {
        this.successMessage = '✓ Configuración guardada exitosamente';
        this.originalFormValue = this.configForm.value;
        this.isSaving = false;
        
        setTimeout(() => this.successMessage = '', 5000);
      },
      error: (error) => {
        console.error('Error guardando configuración:', error);
        this.errorMessage = error.error?.message || 'Error al guardar la configuración. Intenta nuevamente.';
        this.isSaving = false;
        
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  private buildBusinessHoursJson(businessHours: any[]): string {
    const businessHoursObj: BusinessHours = {};
    
    businessHours.forEach(bh => {
      businessHoursObj[bh.day] = {
        enabled: bh.enabled,
        open: bh.open,
        close: bh.close
      };
    });

    return JSON.stringify(businessHoursObj);
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onReset(): void {
    if (confirm('¿Estás seguro de descartar todos los cambios?')) {
      if (this.originalFormValue) {
        this.configForm.patchValue(this.originalFormValue);
        this.loadBusinessHours(JSON.parse(this.originalFormValue.business_hours_json || '{}'));
      }
    }
  }
}
