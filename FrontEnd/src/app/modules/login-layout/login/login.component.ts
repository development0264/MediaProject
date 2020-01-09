import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { HttpClient, HttpHeaders } from "@angular/common/http";

// SERVICES
import { AuthService } from './../../../services/auth.service';

// ERROR MESSAGE
import { SnackbarComponent } from '../../../components/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: []
})

export class LoginComponent implements OnInit {
    form: FormGroup;
    private formSubmitAttempt: boolean;
    httpheaders: HttpHeaders

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        public snack: MatSnackBar,
        private location: PlatformLocation,
        public http: HttpClient,
        //public httpheaders: HttpHeaders,
    ) {
    }

    ngOnInit() {
        /*SI EXISTE UN TOKEN SETEADO TE REDIRECCIONA AL DASHBOARD*/
        if (localStorage.getItem('token')) {
            this.router.navigate(['/']);
        }

        this.form = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
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
            this.authService.login(this.form.value).subscribe((data: any) => {
                if (data.success) {
                    this.authService.loggedIn.next(true); /*SETEA EL METODO loggedIn COMO TRUE EN EL AuthService*/
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('iduser', data.data.id);
                    localStorage.setItem('email', data.data.email); /*SETEA EL TOKEN PROCEDENTE DEL BACKEND*/
                    this.router.navigate(['/']); /*REDIRECCIONA AL DASHBOAR*/
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

    Signup() {
        this.router.navigate(['/signup']);
    }

    ForgotPassword() {
        this.router.navigate(['/forgotpassword']);
    }
}
