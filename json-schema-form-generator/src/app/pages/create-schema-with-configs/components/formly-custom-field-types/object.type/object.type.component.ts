import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FieldConfigurationService } from '../../field-configuration/field-configuration.service';

@Component({
  selector: 'app-object.type',
  templateUrl: './object.type.component.html',
  styleUrl: './object.type.component.scss'
})
export class ObjectTypeComponent extends FieldType {

  constructor(
    private _fieldConfigurationService: FieldConfigurationService
  ) {
    super();
  }

  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.field.fieldGroup, event.previousIndex, event.currentIndex);

    for (let i = 0; i < this.field.fieldGroup.length; i++) {
      const field = this.field.fieldGroup[i];
      this._fieldConfigurationService.formConfiguration.get(field?.id).get('order').setValue(i);
    }
  }

}
