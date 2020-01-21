import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../../utils/shared.module';
import { AdminLayoutComponent } from './admin-layout.component';
import { ContactUsComponent } from '../../components/contact-us/contact-us.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './../token.interceptor';

@NgModule({
    imports: [
        RouterModule,
        SharedModule
    ],
    declarations: [
        AdminLayoutComponent,
        ContactUsComponent
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
    }],
    exports: []
})
export class AdminLayoutModule {
}