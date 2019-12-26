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
import { FormsComponent } from './forms-dash/forms.component';
import { FormsShareComponent } from './forms-share/forms-share.component';
import { SnackbarComponent } from '../../components/snackbar/snackbar.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    providers: [MediaService]
})
export class DashboardComponent implements AfterViewInit {
    imageendpoint: string = environment.imageendpoint;
    displayedColumns = ['id', 'ImageVideoPath', 'filename', 'created', 'Type', 'Actions'];
    dataSource = new MatTableDataSource();

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
        this.getData();
    }

    ngAfterViewChecked() {
        this.cdr.detectChanges();
    }

    openSnack(data) {
        this.snack.openFromComponent(SnackbarComponent, {
            data: { data: data },
            duration: 3000
        });
    }

    onPaginateChange(event) {
        this.page = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.getData();
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.search = filterValue;
        this.getData();
    }

    // GET PERSONS
    getData() {
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.isLoading = true;
                    return this.mediaService!
                        .getList(
                            this.sort.active,
                            this.sort.direction,
                            this.pageSize,
                            this.page,
                            this.search
                        );
                }),
                map(data => {
                    console.log(data)
                    this.isLoading = false;
                    this.isTotalReached = false;
                    this.totalItems = data.recordsTotal;
                    return data.data;
                }),
                catchError(() => {
                    this.isLoading = false;
                    this.isTotalReached = true;
                    return observableOf([]);
                })
            ).subscribe(data => this.dataSource.data = data);
    }

    // EDIT PERSONS
    share(row: Media): void {
        let dialogRef = this.dialog.open(FormsShareComponent, {
            //height: '350px',
            // width: '400px',
            data: { title: 'Share Media', action: 'save', data: row }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result)
                this.getData();
        });
    }

    // SAVE PERSONS
    save(): void {
        let dialogRef = this.dialog.open(FormsComponent, {
            //height: '350px',
            // width: '400px',
            data: { title: 'Add media', action: 'save' }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result)
                this.getData();
        });
    }



}