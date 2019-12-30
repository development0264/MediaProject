import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../../utils/shared.module';

import { SharedComponent } from './shared.component';


@NgModule({
    imports: [
        RouterModule,
        SharedModule
    ],
    declarations: [
        SharedComponent,
    ],
    providers: [],
    exports: []
})
export class SharedImageModule {
}