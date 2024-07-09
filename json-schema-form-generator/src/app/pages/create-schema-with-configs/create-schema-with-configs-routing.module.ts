import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSchemaWithConfigsComponent } from './create-schema-with-configs.component';

const routes: Routes = [
  {
    path: '',
    component: CreateSchemaWithConfigsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateSchemaWithConfigsRoutingModule { }
