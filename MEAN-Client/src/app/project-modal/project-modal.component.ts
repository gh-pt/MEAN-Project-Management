import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Project } from '../CustomClass/project';

@Component({
  selector: 'app-project-modal',
  templateUrl: './project-modal.component.html',
  styleUrls: ['./project-modal.component.css']
})
export class ProjectModalComponent {
  @Input() project!: Project;
  @Output() closeModalEvent = new EventEmitter<void>(); // To notify parent to close modal

  // Method to close the modal
  closeModal() {
    this.closeModalEvent.emit();
  }
}
