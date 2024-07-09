import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchemaFormComponent } from './schema-form.component';

const routes: Routes = [
  {
    path: '',
    component: SchemaFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchemaFormRoutingModule { }
