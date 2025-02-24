import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

export enum ToastType {
    Success = 'success',
    Error = 'error',
}

export interface Toast {
    header: string;
    body: string;
    delay?: number;
    type?: ToastType;
}

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    toasts: Toast[] = [];

    show(header: string, body: string) {
        this.toasts.push({ header, body });
    }

    showSuccess(body: string) {
        this.toasts.push({ header: 'Success', body, type: ToastType.Success });
    }

    showError(body: string) {
        this.toasts.push({ header: 'Error', body, type: ToastType.Error });
    }

    remove(toast: Toast) {
        this.toasts = this.toasts.filter((t) => t != toast);
    }

    withErrorToast(message: string) {
        return <T>(source: Observable<T>) =>
            source.pipe(
                catchError((error) => {
                    this.showError(message);
                    return of([] as T);
                }),
            );
    }
}
