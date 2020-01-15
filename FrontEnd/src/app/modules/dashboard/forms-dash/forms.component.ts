import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MediaService } from '../../../services/media.service';
import { SnackbarComponent } from '../../../components/snackbar/snackbar.component';

import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { MatRadioChange } from '@angular/material';

@Component({
    selector: 'app-forms',
    templateUrl: './forms.component.html',
    styleUrls: ['./forms.component.css']
})

export class FormsComponent implements OnInit {
    frm: FormGroup;
    mediatype: string;
    constructor(
        public dialogRef: MatDialogRef<FormsComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: any,
        private fb: FormBuilder,
        private mediaService: MediaService,
        public snack: MatSnackBar,
        private http: HttpClient
    ) { }


    fileData: string[] = [];
    fileDataVideo: string[] = [];
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
        if (this.data.action == 'edit') {
            let data = this.data.data;
            this.frm = this.fb.group({
                first_name: new FormControl(data.first_name, [Validators.required, Validators.minLength(3)]),
                last_name: new FormControl(data.last_name, [Validators.required, Validators.minLength(3)]),
                age: new FormControl(data.age, [Validators.required, Validators.minLength(1)]),
                gender: new FormControl(data.gender, [Validators.required]),
                id: new FormControl(data.id)
            });
        } else {
            this.frm = new FormGroup({
                // first_name: new FormControl('Test', [Validators.required, Validators.minLength(3)]),
                // last_name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
                // age: new FormControl(null, [Validators.required, Validators.minLength(1)]),
                Type: new FormControl('Image', [Validators.required]),
                id: new FormControl(null)
            });
            this.mediatype = this.frm.controls.Type.value
            this.filetype = "image/*";
        }
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

    fileProgressVideo(e) {
        if (parseInt(e.target.files.length) > 3) {
            alert("You are only allowed to upload a maximum of 3 files");
        } else {
            for (var i = 0; i < e.target.files.length; i++) {
                this.fileDataVideo.push(e.target.files[i]);
            }
        }
        //this.preview();
    }

    radioChange(event: MatRadioChange) {
        this.mediatype = event.value
        console.log(event.value)
        if (event.value == "Image") {
            this.filetype = "image/*";
        } else if (event.value == "Video") {
            this.filetype = "video/*";
        } else {
            this.filetype = "image/*";
        }
    }

    save() {
        if (this.fileData.length > 0) {
            let Type = this.frm.controls.Type.value;
            let formData = new FormData();
            //formData.append(this.frm.controls.Type.value, this.fileData);
            //formData.append('iduser', localStorage.getItem('iduser'));
            for (var i = 0; i < this.fileDataVideo.length; i++) {
                formData.append('files', this.fileDataVideo[i]);
            }
            for (var i = 0; i < this.fileDataVideo.length; i++) {
                formData.append('files', this.fileData[i]);
            }


            this.fileUploadProgress = '0%';

            this.mediaService.SaveMedia(formData, {
                reportProgress: true,
                observe: 'events'
            }, Type).subscribe((data: any) => {
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
        } else {
            this.snack.open('Select atleast one file', 'Close',
                {
                    duration: 3500, verticalPosition: 'top'
                });
        }
    }

    getNameErrorMessage() {
        return this.frm.controls.first_name.hasError('required') ? 'First name is required' :
            this.frm.controls.name.hasError('minlength') ? 'Al menos 2 caracteres' : '';
    }
    getLastNameErrorMessage() {
        return this.frm.controls.last_name.hasError('required') ? 'Last name is required' :
            this.frm.controls.name.hasError('minlength') ? 'Al menos 2 caracteres' : '';
    }
    getAgeErrorMessage() {
        return this.frm.controls.age.hasError('required') ? 'Age is required' :
            this.frm.controls.age.hasError('minlength') ? 'Al menos un numero debe ser ingresado' : '';
    }
    getImageTypeErrorMessage() {
        return this.frm.controls.Type.hasError('required') ? '' : '';
    }
}
