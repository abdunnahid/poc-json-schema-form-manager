import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { JSONSchema7 } from 'json-schema';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { JsonSchemaApiService, JsonSchemaModel } from '../../api/json-schema-api.service';
import { ActivatedRoute } from '@angular/router';

const EXAMPLE_DATA = {
  "firstName": "John",
  "lastName": "Doe",
  "age": 30,
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "address": {
    "streetAddress": "1234 Elm Street",
    "city": "Somewhere",
    "state": "CA",
    "postalCode": "90210"
  },
  "isEmployed": false,
  "employmentDetails": {
    "employer": "Example Corp",
    "position": "Software Engineer"
  },
  "dependents": [
    {
      "name": "Jane Doe",
      "age": 5
    },
    {
      "name": "Jack Doe",
      "age": 3
    }
  ],
  "gender": "Male",
  "nationality": "American"
};

interface Configuration {
  [key: string]: {
    autoPopulate: boolean;
    autoPopulateField: string;
    order: number;
  };
}

interface FieldConfig {
  id?: string;
  key?: string;
  fieldGroup?: FieldConfig[];
  [key: string]: any;
}

@Component({
  selector: 'app-schema-form',
  templateUrl: './schema-form.component.html',
  styleUrl: './schema-form.component.scss'
})
export class SchemaFormComponent implements OnInit {

  schemaId: string;
  form: FormGroup;
  fields: any[];
  options: FormlyFormOptions = {};

  constructor(
    private _formlyJsonschema: FormlyJsonschema,
    private _jsonSchemaApiService: JsonSchemaApiService,
    private _activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit(): Promise<void> {
    const schemaId = this._activatedRoute.snapshot.params['id'];
    const response = await this._jsonSchemaApiService.getSchemaById(schemaId);
    this.generateForm(JSON.parse(response.schema), JSON.parse(response.configuration));
    this.schemaId = schemaId;
  }

  private generateForm(schema: any, configuration: any) {

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

    this.fields = this.reorderFields(this.fields, configuration);

    setTimeout(() => {
      this.form.patchValue(EXAMPLE_DATA);
      console.log("🚀 ~ SchemaFormComponent ~ generateForm ~ this.form:", this.form.value)
    }, 0);

  }

  private mapField(mappedField: FormlyFieldConfig, mapSource: JSONSchema7): FormlyFieldConfig {

    mappedField.props.label = (mappedField?.key || '').toString() || mappedField?.props.description;
    mappedField.props.placeholder = mappedField?.props.description;
    mappedField.id = mapSource.$id;

    mappedField.hooks

    return mappedField;
  }

  public async submit(): Promise<void> {

    console.log("FORM VALUES: ", this.form.value);

    const payload = this.form.value;

    const response = await this._jsonSchemaApiService.validateDataAgainstSchema(this.schemaId, payload);
    console.log("🚀 ~ SchemaFormComponent ~ submit ~ response:", response)

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

  private reorderFields(fields: FieldConfig[], config: Configuration): FieldConfig[] {

    const getOrder = (id: string) => (config[id] ? config[id].order : Number.MAX_SAFE_INTEGER);

    // Recursively reorder field groups
    const reorderFieldGroup = (fieldGroup: FieldConfig[]) => {
      fieldGroup.forEach(field => {
        if (field.fieldGroup) {
          field.fieldGroup = reorderFieldGroup(field.fieldGroup);
        }
      });

      return fieldGroup.sort((a, b) => getOrder(a.id || '') - getOrder(b.id || ''));
    };

    return reorderFieldGroup(fields);
  }
}
