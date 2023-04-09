import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartsPageComponent } from './charts-page/charts-page.component';

const routes: Routes = [
  {path: '**', component: ChartsPageComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
