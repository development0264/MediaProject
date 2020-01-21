import { Component, AfterViewInit, ViewChild, ChangeDetectorRef, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Observable, merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { Router } from '@angular/router';

import { Media } from '../../models/Media';
import { MediaService } from '../../services/media.service';
import { AuthService } from '../../services/auth.service';
import { environment } from './../../../environments/environment';

// DIALOGS
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from '../../components/confirm/confirm.component';
import { SnackbarComponent } from '../../components/snackbar/snackbar.component';
import { AdminlayoutService } from '../admin-layout/admin-layout.service';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css'],
    providers: [MediaService]
})
export class NotificationComponent implements AfterViewInit {
    imageendpoint: string = environment.imageendpoint;
    displayedColumns = ['id', 'url', 'name', 'title', 'description', 'isread'];
    //dataSource = new MatTableDataSource();
    dataSource = [];
    resultsLength = 0;

    pageEvent: PageEvent;
    pageSizeOptions = [5, 10, 25, 100]; /*CANTIDADES DE DATOS QUE SE PUEDEN MOSTRAR EN LA TABLA*/
    pageSize = 5; /*CANTIDAD DE DATOS QUE SE MUESTRAN AL CARGAR EL GRID */
    page = 0; /*PAGINA QUE SE MOSTRARA AL CARGAR EL GRID*/
    isLoading = false;
    isTotalReached = false;
    totalItems = 0;
    search = '';

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    @ViewChild('video', { static: false }) matVideo: ElementRef;

    constructor(
        private cdr: ChangeDetectorRef,
        private mediaService: MediaService,
        private authService: AuthService,
        private router: Router,
        public dialog: MatDialog,
        public snack: MatSnackBar,
        private adminlayoutService: AdminlayoutService
    ) { }

    // IMPORTANTE: VERIFICAR SI EL TOKEN EXISTE.
    ngOnInit() {
        // VERIFICA QUE LA SESIÓN EXISTA EN AUTH.SERVICE.TS
        if (!this.authService.loggedIn.getValue()) {
            this.router.navigate(['/login']);
        }
    }

    ngAfterViewInit() {
        // ANTES QUE LA VISTA CARGUE INICIA LA CARGA DE DATOS EN EL GRID
        this.getnotification();
    }

    getnotification() {
        this.mediaService.notificationcount().subscribe((data: any) => {
            console.log(data.data)
            this.dataSource = data.data
        })
    }

    notificationupdate(row) {
        var data = new Object();
        data["id"] = row.id;

        this.mediaService.notificationupdate(data).subscribe((data: any) => {
            if (data.success) {
                this.getnotification();
                this.adminlayoutService.getnotification();
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
}
