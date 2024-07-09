import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListConfiguredSchemasComponent } from './pages/list-configured-schemas/list-configured-schemas.component';

const routes: Routes = [
  {
    path: '',
    component: ListConfiguredSchemasComponent
  },
  {
    path: 'config',
    loadChildren: () => import('./pages/create-schema-with-configs/create-schema-with-configs-routing.module')
      .then(module => module.CreateSchemaWithConfigsRoutingModule),
  },
  {
    path: ':id',
    loadChildren: () => import('./pages/schema-form/schema-form.module')
    .then(module => module.SchemaFormModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
