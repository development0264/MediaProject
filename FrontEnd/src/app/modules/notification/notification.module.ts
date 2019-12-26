import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../../utils/shared.module';

import { NotificationComponent } from './notification.component';

@NgModule({
    imports: [
        RouterModule,
        SharedModule
    ],
    declarations: [
        NotificationComponent,
    ],
    providers: [],
    exports: []
})
export class DashboardModule {
}