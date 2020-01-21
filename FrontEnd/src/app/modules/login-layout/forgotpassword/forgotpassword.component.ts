import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { PlatformLocation } from '@angular/common';

// SERVICES
import { AuthService } from './../../../services/auth.service';

// ERROR MESSAGE
import { SnackbarComponent } from '../../../components/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-login',
    templateUrl: './forgotpassword.component.html',
    styleUrls: ['./forgotpassword.component.css'],
    providers: []
})

export class ForgotPasswordComponent implements OnInit {
    form: FormGroup;
    private formSubmitAttempt: boolean;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        public snack: MatSnackBar,
        private location: PlatformLocation
    ) {
    }

    ngOnInit() {
        /*SI EXISTE UN TOKEN SETEADO TE REDIRECCIONA AL DASHBOARD*/
        if (localStorage.getItem('token')) {
            this.router.navigate(['/']);
        }

        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    isFieldInvalid(field: string) {
        return (
            (!this.form.get(field).valid && this.form.get(field).touched) ||
            (this.form.get(field).untouched && this.formSubmitAttempt)
        );
    }

    onSubmit() {
        if (this.form.valid) {
            this.authService.forgotpassword(this.form.value).subscribe((data: any) => {
                if (data.success) {
                    this.snack.openFromComponent(SnackbarComponent, {
                        data: { data: data },
                        verticalPosition: 'top',
                        duration: 3000
                    });
                } else { /*SINO MUESTRA UN MENSAJE DE ERROR PROCEDENTE DEL BACKEND*/
                    // this.snack.openFromComponent(SnackbarComponent, {
                    //     data: { data: data },
                    //     duration: 3000
                    // });
                }
            })
        }
        this.formSubmitAttempt = true;
    }

    Login() {
        this.router.navigate(['/login']);
    }
}
