import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../../utils/shared.module';

import { DashboardComponent } from './dashboard.component';
import { FormsComponent } from './forms-dash/forms.component';
import { FormsShareComponent } from './forms-share/forms-share.component';

@NgModule({
    imports: [
        RouterModule,
        SharedModule
    ],
    declarations: [
        DashboardComponent,
        FormsComponent,
        FormsShareComponent
    ],
    providers: [],
    entryComponents: [
        FormsComponent,
        FormsShareComponent
    ],
    exports: []
})
export class DashboardModule {
}