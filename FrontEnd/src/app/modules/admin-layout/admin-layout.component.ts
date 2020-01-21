import { Component, OnInit, ChangeDetectorRef, NgZone, ElementRef, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import {
    Router,
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError
} from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AdminlayoutService } from './admin-layout.service';
import { CONSTANST } from '../../utils/constanst';


// LOGOUT CONFIRM DIALOG
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../components/confirm/confirm.component';

import { MediaService } from '../../services/media.service';

import * as io from 'socket.io-client';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-admin-layout',
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.css'],
    providers: [AuthService]
})

export class AdminLayoutComponent implements OnInit {
    isLoggedIn$: Observable<boolean>;
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    private url = 'http://localhost:3000';
    terms = CONSTANST.routes.generic.terms;
    private socket;
    notificationcount = 0

    @ViewChild('progressBar', { static: false })
    progressBar: ElementRef;

    constructor(
        private authService: AuthService,
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        public dialog: MatDialog,

        private router: Router,
        private ngZone: NgZone,
        private renderer: Renderer2,
        public snack: MatSnackBar,
        private mediaService: MediaService,
        private adminlayoutService: AdminlayoutService
    ) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);

        router.events.subscribe((event: RouterEvent) => {
            this._navigationInterceptor(event)
        });
        this.socket = io(this.url);

    }

    public getMessages = () => {
        return Observable.create((observer) => {
            this.socket.on(localStorage.getItem('email') + '-notifications', (message) => {
                observer.next(message);
            });
        });
    }



    ngOnInit() {
        this.isLoggedIn$ = this.authService.isLoggedIn;
        this.getnotificationcount();
        this.getMessages().subscribe((message: any) => {
            this.snack.open(message.message, 'Close',
                {
                    duration: 3500, verticalPosition: 'top'
                });
            this.getnotificationcount();
        })

        this.adminlayoutService.change.subscribe(isOpen => {
            this.getnotificationcount();
        });
    }

    getnotificationcount() {
        this.mediaService.notificationcount().subscribe((data: any) => {
            console.log(data)
            this.notificationcount = data.unreadcount
        })
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    openDialog(): void { /*ABRE EL COMPONENTE ConfirmComponent, LE INYECTA LOS DATOS A MOSTRAR Y SE SUSCRIBE PARA VER LA RESPUESTA BOOLEANA*/
        let dialogRef = this.dialog.open(ConfirmComponent, {
            width: '250px',
            data: {
                title: 'Logout',
                message: 'Close session?'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.authService.loggedIn.next(false);
                localStorage.removeItem('token');
                this.router.navigate(['/login']);

            }
        });
    }

    // BARRA DE PROGRESO
    private _navigationInterceptor(event: RouterEvent): void {
        if (event instanceof NavigationStart) {
            this.ngZone.runOutsideAngular(() => {
                this.renderer.setStyle(this.progressBar.nativeElement, 'opacity', '1')
            })
        }
        if (event instanceof NavigationEnd) {
            setTimeout(() => {
                this._hideProgressBar();
            }, 1000);
        }
        if (event instanceof NavigationCancel) {
            setTimeout(() => {
                this._hideProgressBar();
            }, 1000);
        }
        if (event instanceof NavigationError) {
            setTimeout(() => {
                this._hideProgressBar();
            }, 1000);
        }
    }
    /* OCULTA LA BARRA DE PROGRESO CUANDO LA PAGINA
    DEJA DE CARGAR */
    private _hideProgressBar(): void {
        this.ngZone.runOutsideAngular(() => {
            this.renderer.setStyle(this.progressBar.nativeElement, 'opacity', '0')
        })
    }
}