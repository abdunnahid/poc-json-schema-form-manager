import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateSchemaWithConfigsRoutingModule } from './create-schema-with-configs-routing.module';
import { CreateSchemaWithConfigsComponent } from './create-schema-with-configs.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { typeValidationMessage, minLengthValidationMessage, maxLengthValidationMessage, minValidationMessage, maxValidationMessage, multipleOfValidationMessage, exclusiveMinimumValidationMessage, exclusiveMaximumValidationMessage, minItemsValidationMessage, maxItemsValidationMessage, constValidationMessage } from './formly-validation-messages';
import { FieldConfigurationComponent } from './components/field-configuration/field-configuration.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { ArrayTypeComponent } from './components/formly-custom-field-types/array.type/array.type.component';
import { MultischemaTypeComponent } from './components/formly-custom-field-types/multischema.type/multischema.type.component';
import { NullTypeComponent } from './components/formly-custom-field-types/null.type/null.type.component';
import { ObjectTypeComponent } from './components/formly-custom-field-types/object.type/object.type.component';
import { FieldConfigurationService } from './components/field-configuration/field-configuration.service';

@NgModule({
  declarations: [
    FileUploadComponent,
    FieldConfigurationComponent,
    ObjectTypeComponent,
    ArrayTypeComponent,
    MultischemaTypeComponent,
    NullTypeComponent,
    CreateSchemaWithConfigsComponent,
  ],
  imports: [
    CommonModule,
    CreateSchemaWithConfigsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSelectModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    DragDropModule,
    MatDialogModule,
    FormlyModule.forRoot({
      validationMessages: [
        { name: 'required', message: 'This field is required' },
        { name: 'type', message: typeValidationMessage },
        { name: 'minLength', message: minLengthValidationMessage },
        { name: 'maxLength', message: maxLengthValidationMessage },
        { name: 'min', message: minValidationMessage },
        { name: 'max', message: maxValidationMessage },
        { name: 'multipleOf', message: multipleOfValidationMessage },
        { name: 'exclusiveMinimum', message: exclusiveMinimumValidationMessage },
        { name: 'exclusiveMaximum', message: exclusiveMaximumValidationMessage },
        { name: 'minItems', message: minItemsValidationMessage },
        { name: 'maxItems', message: maxItemsValidationMessage },
        { name: 'uniqueItems', message: 'should NOT have duplicate items' },
        { name: 'const', message: constValidationMessage },
        { name: 'enum', message: `must be equal to one of the allowed values` },
      ],
      types: [
        { name: 'object', component: ObjectTypeComponent },
        { name: 'array', component: ArrayTypeComponent },
        { name: 'null', component: NullTypeComponent, wrappers: ['form-field'] },
        { name: 'multischema', component: MultischemaTypeComponent }
      ],
    }),
    FormlyMaterialModule
  ],
  providers:[
    FieldConfigurationService
  ]
})
export class CreateSchemaWithConfigsModule { }
