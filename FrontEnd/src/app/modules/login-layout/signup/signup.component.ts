import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { PlatformLocation } from '@angular/common';

// SERVICES
import { AuthService } from './../../../services/auth.service';

// ERROR MESSAGE
import { SnackbarComponent } from '../../../components/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material';

// import custom validator to validate that password and confirm password fields match
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
        const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

        return (invalidCtrl || invalidParent);
    }
}

@Component({
    selector: 'app-login',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
    providers: []
})

export class SignupComponent implements OnInit {
    form: FormGroup;
    formresend: FormGroup;
    private formSubmitAttempt: boolean;
    matcher = new MyErrorStateMatcher();

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        public snack: MatSnackBar,
        private location: PlatformLocation
    ) {
        this.form = this.fb.group({
            name: [''],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            confirmpassword: ['']
        }, {
            validator: this.checkPasswords
        });

        this.formresend = this.fb.group({
            emailresend: ['', [Validators.required, Validators.email]],
        });
    }

    get f() { return this.form.controls; }

    ngOnInit() {
        /*SI EXISTE UN TOKEN SETEADO TE REDIRECCIONA AL DASHBOARD*/
        if (localStorage.getItem('token')) {
            this.router.navigate(['/']);
        }

    }


    checkPasswords(group: FormGroup) { // here we have the 'passwords' group    
        let pass = group.controls.password.value;
        let confirmPass = group.controls.confirmpassword.value;

        return pass === confirmPass ? null : { notSame: true }
    }

    isFieldInvalid(field: string) {
        return (
            (!this.form.get(field).valid && this.form.get(field).touched) ||
            (this.form.get(field).untouched && this.formSubmitAttempt)
        );
    }

    isResebdFieldInvalid(field: string) {
        return (
            (!this.formresend.get(field).valid && this.formresend.get(field).touched) ||
            (this.formresend.get(field).untouched && this.formSubmitAttempt)
        );
    }

    onSubmit() {
        if (this.form.valid) {
            this.authService.signup(this.form.value).subscribe((data: any) => {
                if (data.success) {
                    this.snack.open(data.message, 'Close',
                        {
                            duration: 3500, verticalPosition: 'top'
                        });
                } else { /*SINO MUESTRA UN MENSAJE DE ERROR PROCEDENTE DEL BACKEND*/
                    this.snack.open(data.message, 'Close',
                        {
                            duration: 3500, verticalPosition: 'top'
                        });
                }
            })
        }
        this.formSubmitAttempt = true;
    }


    onResendSubmit() {
        if (this.formresend.valid) {
            console.log(this.formresend.value)
            this.authService.resend(this.formresend.value).subscribe((data: any) => {
                if (data.success) {
                    this.snack.open(data.message, 'Close',
                        {
                            duration: 3500, verticalPosition: 'top'
                        });
                } else { /*SINO MUESTRA UN MENSAJE DE ERROR PROCEDENTE DEL BACKEND*/
                    this.snack.open(data.message, 'Close',
                        {
                            duration: 3500, verticalPosition: 'top'
                        });
                }
            })
        }
        this.formSubmitAttempt = true;
    }



    Login() {
        this.router.navigate(['/login']);
    }
}
