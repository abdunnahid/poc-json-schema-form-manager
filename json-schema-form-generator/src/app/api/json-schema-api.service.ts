import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface JsonSchemaModel {
  id?: string;
  schema: string;
  configuration: string;
}

@Injectable({
  providedIn: 'root'
})
export class JsonSchemaApiService {

  private apiUrl = 'http://localhost:5191/api/JsonSchema'; // Update this with your API URL

  constructor(
    private http: HttpClient
  ) { }

  public saveSchema(model: JsonSchemaModel): Promise<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return firstValueFrom(this.http.post(this.apiUrl, model, { headers }));
  }

  public getSchemaList(): Promise<JsonSchemaModel[]> {
    return firstValueFrom(this.http.get<JsonSchemaModel[]>(this.apiUrl));
  }

  public getSchemaById(id: string): Promise<JsonSchemaModel> {
    return firstValueFrom(this.http.get<JsonSchemaModel>(`${this.apiUrl}/${id}`));
  }

  validateDataAgainstSchema(id: string, data: any): Promise<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { data: JSON.stringify(data) };
    return firstValueFrom(this.http.post(`${this.apiUrl}/${id}`, body, { headers }));
  }

}
