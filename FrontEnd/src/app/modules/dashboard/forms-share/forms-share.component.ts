import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MediaService } from '../../../services/media.service';
import { SnackbarComponent } from '../../../components/snackbar/snackbar.component';

import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { MatRadioChange } from '@angular/material';

@Component({
    selector: 'app-forms-share',
    templateUrl: './forms-share.component.html',
    styleUrls: ['./forms-share.component.css']
})

export class FormsShareComponent implements OnInit {
    frm: FormGroup;
    private formSubmitAttempt: boolean;

    constructor(
        public dialogRef: MatDialogRef<FormsShareComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: any,
        private fb: FormBuilder,
        private mediaService: MediaService,
        public snack: MatSnackBar,
        private http: HttpClient
    ) { }


    fileData: string[] = [];
    previewUrl: any = null;
    fileUploadProgress: string = null;
    uploadedFilePath: string = null;
    filetype: string = null;



    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit() {
        this.initializeForm();
    }

    openSnack(data) {
        this.snack.openFromComponent(SnackbarComponent, {
            data: { data: data },
            duration: 3000
        });
    }

    initializeForm() {
        let data = this.data.data;
        this.frm = this.fb.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            photoids: new FormControl(data.id)
        });

    }

    isFieldInvalid(field: string) {
        return (
            (!this.frm.get(field).valid && this.frm.get(field).touched) ||
            (this.frm.get(field).untouched && this.formSubmitAttempt)
        );
    }

    fileProgress(e) {
        if (parseInt(e.target.files.length) > 3) {
            alert("You are only allowed to upload a maximum of 3 files");
        } else {
            for (var i = 0; i < e.target.files.length; i++) {
                this.fileData.push(e.target.files[i]);
            }
        }
        //this.preview();
    }

    // preview() {
    //     // Show preview 
    //     var mimeType = this.fileData.type;
    //     if (mimeType.match(/image\/*/) == null) {
    //         return;
    //     }

    //     var reader = new FileReader();
    //     reader.readAsDataURL(this.fileData);
    //     reader.onload = (_event) => {
    //         this.previewUrl = reader.result;
    //     }
    // }

    radioChange(event: MatRadioChange) {
        if (event.value == "Image") {
            this.filetype = "image/*";
        } else if (event.value == "Video") {
            this.filetype = "video/*";
        } else {
            this.filetype = "video/*,image/*";
        }
    }

    Share() {
        this.mediaService.share(this.frm.value).subscribe((data: any) => {
            if (data.success) {
                this.dialogRef.close(true);
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

    getNameErrorMessage() {
        return this.frm.controls.first_name.hasError('required') ? 'First name is required' :
            this.frm.controls.name.hasError('minlength') ? 'Al menos 2 caracteres' : '';
    }
    getLastNameErrorMessage() {
        return this.frm.controls.last_name.hasError('required') ? 'Last name is required' :
            this.frm.controls.name.hasError('minlength') ? 'Al menos 2 caracteres' : '';
    }

    getImageTypeErrorMessage() {
        return this.frm.controls.Type.hasError('required') ? '' : '';
    }
}
