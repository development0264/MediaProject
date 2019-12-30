import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from "@angular/common/http";

/*ESTE ARCHIVO CONTIENE IMPORTACIONES QUE ESTAN EN TODOS LOS MODULOS
PARA AHORRARSE LINEAS SE IMPORTAN EN EL Y LUEGO EL ARCHIVO SE IMPORTA
EN TODOS LOS MODULOS*/
import { SharedModule } from './utils/shared.module';

// IMPORTACION DEL MODULO DE RUTAS
import { AppRoutingModule } from "./app.routes";

// IMPORTACION DE LOS GUARDS
import { AuthGuard } from './guards/auth.guard';

// PLUGGINS https://angular.io/guide/rx-library
import './rxjs-operators';

// COMPONENTS
import { AppComponent } from './components/app/app.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';

// IMPORTACIÓN DE LOS SERVICES
import { AuthService } from './services/auth.service';
import { MediaService } from './services/media.service';
import { MatVideoModule } from 'mat-video';
import { AdminlayoutService } from '../app/modules/admin-layout/admin-layout.service';
/*IMPORTACION DE LOS MODULES QUE A SU VEZ ELLOS IMPORTAN SUS PROPIOS COMPONENTES
ASI SE EVITA SATURAR ESTE ARCHIVO DE IMPORTACIONES Y SE MODULARIZA EL PROYECTO.*/
import { UserComponent } from './modules/user/user.component';
import { AdminLayoutModule } from './modules/admin-layout/admin-layout.module';
import { LoginLayoutModule } from './modules/login-layout/login-layout.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { SharedImageModule } from './modules/shared/shared.module';
import { NotificationComponent } from './modules/notification/notification.component';
// import { DashboardComponent } from './modules/dashboard/dashboard.component';
// import { PersonComponent } from './modules/person/person.component';



@NgModule({
    declarations: [ /*DECLARACIÓN DE COMPONENTES*/
        AppComponent,
        NotificationComponent,
        ContactUsComponent,
        NotFoundComponent,
        UserComponent,
        ConfirmComponent,
        SnackbarComponent,
        //PersonComponent
    ],
    imports: [ /*DECLARACIÓN DE MODULOS*/
        SharedModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        AdminLayoutModule,
        LoginLayoutModule,
        MatVideoModule,
        DashboardModule,
        SharedImageModule
    ],
    providers: [ /*DECLARACIÓN DE SERVICIOS*/
        AuthGuard,
        AuthService,
        MediaService,
        AdminlayoutService
    ],
    entryComponents: [ /*AQUI SE AGREGAN LOS MAT-CONFIRM Y LOS MAT-SNACKBAR DE ANGULAR MATERIAL*/
        ConfirmComponent,
        SnackbarComponent
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
