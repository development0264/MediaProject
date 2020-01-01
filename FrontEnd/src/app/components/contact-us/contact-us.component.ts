import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MediaService } from '../../services/media.service';
import { SnackbarComponent } from '../../components/snackbar/snackbar.component';

import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { MatRadioChange } from '@angular/material';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
  providers: [MediaService]
})
export class ContactUsComponent implements OnInit {
  form: FormGroup;
  private formSubmitAttempt: boolean;

  constructor(
    // public data: any,
    private fb: FormBuilder,
    private mediaService: MediaService,
    public snack: MatSnackBar,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      message: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }


  ngOnInit() {
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.mediaService.contactus(this.form.value).subscribe((data: any) => {
        if (data.success) {
          this.form.reset();
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

}
