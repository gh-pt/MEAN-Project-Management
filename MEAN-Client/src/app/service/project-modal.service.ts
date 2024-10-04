import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectModalService {

  private modalToggleSubject = new Subject<void>();

  toggleModal$ = this.modalToggleSubject.asObservable();

  toggleModal() {
    this.modalToggleSubject.next();
  }

  getModalId() {
    return 'authentication-modal';
  }
}