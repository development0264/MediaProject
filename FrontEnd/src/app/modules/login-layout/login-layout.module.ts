import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from './../../utils/shared.module';
import { LoginLayoutComponent } from './login-layout.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetPasswordComponent } from './resetpassword/resetpassword.component';

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
    providers: [],
    exports: []
})
export class LoginLayoutModule {
}

