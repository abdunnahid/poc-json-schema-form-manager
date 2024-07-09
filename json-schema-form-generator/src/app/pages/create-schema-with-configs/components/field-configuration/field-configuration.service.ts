import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Injectable()
export class FieldConfigurationService {

  formConfiguration: FormGroup;

  public init() {
    this.formConfiguration = new FormGroup({});
  }

  public initializeFieldConfiguraion(field: FormlyFieldConfig): AbstractControl<FormGroup> {

    if (this.formConfiguration.get(field.id)) {
      return this.formConfiguration.get(field.id);
    }

    this.formConfiguration.addControl(
      field.id,
      new FormGroup({
        autoPopulate: new FormControl<boolean>(false),
        autoPopulateField: new FormControl<string>(''),
        order: new FormControl<number>(null)
      })
    );

    return this.formConfiguration.get(field.id);
  }

}
