import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from './../../utils/shared.module';
import { LoginLayoutComponent } from './login-layout.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetPasswordComponent } from './resetpassword/resetpassword.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './../token.interceptor';

@NgModule({
    imports: [
        RouterModule,
        SharedModule
    ],
    declarations: [
        LoginLayoutComponent,
        LoginComponent,
        SignupComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
    }],
    exports: []
})
export class LoginLayoutModule {
}

