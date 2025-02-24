import { Component } from '@angular/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { ToastService, ToastType } from '../../services/toast.service';

@Component({
    selector: 'app-toast',
    imports: [NgbToast],
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.scss',
})
export class ToastComponent {
    constructor(public toastService: ToastService) {}

    protected readonly ToastType = ToastType;
}
