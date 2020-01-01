import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../../utils/shared.module';
import { AdminLayoutComponent } from './admin-layout.component';
import { ContactUsComponent } from '../../components/contact-us/contact-us.component';

@NgModule({
    imports: [
        RouterModule,
        SharedModule
    ],
    declarations: [
        AdminLayoutComponent,
        ContactUsComponent
    ],
    providers: [],
    exports: []
})
export class AdminLayoutModule {
}