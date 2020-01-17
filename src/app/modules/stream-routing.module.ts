import { HeaderComponent } from "../header/header.component";
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path : 'header',
        component : HeaderComponent
    }
];

@NgModule({
    imports : [RouterModule.forRoot(routes)],
    exports : [RouterModule]
})

export class StreamRoutesModule{}