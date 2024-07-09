import { Component, OnInit } from '@angular/core';
import { JsonSchemaApiService, JsonSchemaModel } from '../../api/json-schema-api.service';

@Component({
  selector: 'app-list-configured-schemas',
  templateUrl: './list-configured-schemas.component.html',
  styleUrl: './list-configured-schemas.component.scss'
})
export class ListConfiguredSchemasComponent implements OnInit {

  schemaList: JsonSchemaModel[] = [];

  constructor(
    private _jsonSchemaApiService: JsonSchemaApiService
  ) { }

  async ngOnInit(): Promise<void> {
    const response = await this._jsonSchemaApiService.getSchemaList();
    console.log("🚀 ~ ListConfiguredSchemasComponent ~ ngOnInit ~ response:", response)
    this.schemaList = response.map((value) => {
      return {
        id: value.id,
        schema: JSON.parse(value.schema),
        configuration: JSON.parse(value.configuration)
      }
    });
    console.log("🚀 ~ ListConfiguredSchemasComponent ~ this.schemaList=response.map ~ this.schemaList:", this.schemaList)
  }
}
