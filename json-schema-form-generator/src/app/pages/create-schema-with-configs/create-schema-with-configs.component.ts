import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { JSONSchema7 } from 'json-schema';
import { FormlyJsonschema, } from '@ngx-formly/core/json-schema';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FieldConfigurationService } from './components/field-configuration/field-configuration.service';
import { JsonSchemaApiService, JsonSchemaModel } from '../../api/json-schema-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-schema-with-configs',
  templateUrl: './create-schema-with-configs.component.html',
  styleUrl: './create-schema-with-configs.component.scss'
})
export class CreateSchemaWithConfigsComponent {

  schema: string;
  form: FormGroup;
  fields: any[];
  options: FormlyFormOptions;

  formConfiguration: FormGroup = new FormGroup({});

  constructor(
    private _formlyJsonschema: FormlyJsonschema,
    private _fieldConfigurationService: FieldConfigurationService,
    private _jsonSchemaApiService: JsonSchemaApiService,
    private _router: Router
  ) {
    this._fieldConfigurationService.init();
  }

  async onFileProcessed(schema: any) {
    this.schema = schema;
    this.generateForm(schema);
  }

  private generateForm(schema: any) {

    this.form = new FormGroup({});
    this.options = {};

    schema = JSON.parse(JSON.stringify(schema));
    schema = this.addIdToSchema(schema);

    this.fields = [
      this._formlyJsonschema.toFieldConfig(
        schema,
        {
          map: this.mapField,
        }
      )
    ];

    console.log('Fields: ', this.fields);

  }

  private mapField(mappedField: FormlyFieldConfig, mapSource: JSONSchema7): FormlyFieldConfig {

    mappedField.props.label = (mappedField?.key || '').toString() || mappedField?.props.description;
    mappedField.props.placeholder = mappedField?.props.description;
    mappedField.id = mapSource.$id;

    return mappedField;
  }

  public async submit() {

    console.log("SCHEMA: ", this.schema);
    console.log("SCHEMA CONFIGS: ", this._fieldConfigurationService.formConfiguration.value)
    console.log("FIELDS: ", this.fields);
    console.log("FORM VALUES: ", this.form.value);

    const payload: JsonSchemaModel = {
      schema: JSON.stringify(this.schema),
      configuration: JSON.stringify(this._fieldConfigurationService.formConfiguration.value)
    }

    const response = await this._jsonSchemaApiService.saveSchema(payload);
    console.log('Response: ', response);

    this.schema = null;
    this.form = new FormGroup({});
    this.options = {};
    this.fields = [];

    this._router.navigate(['']);


  }

  private addIdToSchema(schema: { [key: string]: any }, parentPath: string = ''): any {
    if (!schema || typeof schema !== 'object') {
      return schema;
    }

    const newSchema = { ...schema };

    if (newSchema['properties']) {
      newSchema['properties'] = Object.keys(newSchema['properties']).reduce((acc, key) => {
        const propertyPath = parentPath ? `${parentPath}__${key}` : key;
        const property = this.addIdToSchema(newSchema['properties'][key], propertyPath);
        property['$id'] = propertyPath;
        acc[key] = property;
        return acc;
      }, {} as Record<string, { [key: string]: any }>);
    }

    if (newSchema['items']) {
      const itemPath = parentPath ? `${parentPath}__items` : 'items';
      newSchema['items'] = this.addIdToSchema(newSchema['items'], itemPath);
    }

    return newSchema;
  }

}
