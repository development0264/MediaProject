import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { PlatformLocation } from '@angular/common';

// SERVICES
import { AuthService } from './../../../services/auth.service';

// ERROR MESSAGE
import { SnackbarComponent } from '../../../components/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    templateUrl: './resetpassword.component.html',
    styleUrls: ['./resetpassword.component.css'],
    providers: []
})

export class ResetPasswordComponent implements OnInit {
    form: FormGroup;
    private formSubmitAttempt: boolean;
    private token: string;
    matcher = new MyErrorStateMatcher();

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        public snack: MatSnackBar,
        private location: PlatformLocation,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        /*SI EXISTE UN TOKEN SETEADO TE REDIRECCIONA AL DASHBOARD*/
        if (localStorage.getItem('token')) {
            this.router.navigate(['/']);
        }
        this.token = this.route.snapshot.queryParamMap.get("token");

        this.form = this.fb.group({
            password: ['', Validators.required],
            confirmpassword: [''],
            token: this.token
        }, {
            validator: this.checkPasswords
        });
        this.requesttokencheck()
    }

    requesttokencheck() {
        if (this.token) {
            this.authService.request(this.token).subscribe((data: any) => {
                if (!data.success) {
                    this.router.navigate(['**']);
                }
            })
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

    onSubmit() {
        if (this.form.valid) {
            this.authService.confirm(this.form.value).subscribe((data: any) => {
                if (data.success) {
                    this.snack.open(data.message, 'Close',
                        {
                            duration: 3500, verticalPosition: 'top'
                        });
                    this.router.navigate(['/login']);
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

    // Login() {
    //     this.router.navigate(['/login']);
    // }
}
