import { Component, inject, Input, TemplateRef, viewChild } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FieldConfigurationService } from './field-configuration.service';
import { MatDialog } from '@angular/material/dialog';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'field-configuration',
  templateUrl: './field-configuration.component.html',
  styleUrls: ['./field-configuration.component.scss']
})
export class FieldConfigurationComponent {

  fieldConfig: AbstractControl;

  _field: FormlyFieldConfig;
  get field(): FormlyFieldConfig {
    return this._field;
  }
  @Input() set field(value: { field: FormlyFieldConfig, index: number }) {
    if (!value) { return; }
    this._field = value.field;
    this.fieldConfig = this._fieldConfigurationService.initializeFieldConfiguraion(this._field);
    this.fieldConfig.setValue({
      autoPopulate: false,
      autoPopulateField: '',
      order: value.index
    });
  }

  readonly dialogTemplate = viewChild.required(TemplateRef);

  readonly dialog = inject(MatDialog);

  constructor(
    private _fieldConfigurationService: FieldConfigurationService
  ) { }

  public configureField() {
    console.log("field: ", this._field);
    return this.dialog.open(
      this.dialogTemplate(),
      {
        autoFocus: false,
        minHeight: '400px',
        minWidth: '500px'
      }
    );
  }

  public submit(): void {
    console.log("Field Config: ", this.fieldConfig.value);
  }
}
