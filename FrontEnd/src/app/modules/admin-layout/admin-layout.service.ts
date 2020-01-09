import { Injectable, Output, EventEmitter } from '@angular/core'

@Injectable()
export class AdminlayoutService {

    @Output() change: EventEmitter<boolean> = new EventEmitter();

    getnotification() {
        this.change.emit();
    }

}