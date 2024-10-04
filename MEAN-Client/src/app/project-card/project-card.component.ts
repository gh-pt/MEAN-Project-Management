import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { Project } from '../CustomClass/project';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent {
  @Input() project!: Project;
  @Output() emitter = new EventEmitter<object>();
  @Output() editProjectEvent = new EventEmitter<object>(); // Emit project ID to parent
  isModalOpen = false;
  selectedProject: any = null;
  isDashboard: boolean = false; // To track if the current route is '/dashboard'

  constructor(private router: Router) { }

  // Check if the current URL contains '/dashboard'
  ngOnInit(): void {
    this.isDashboard = this.router.url.includes('/dashboard');
  }

  // Emit the project ID when the edit button is clicked
  editProject() {
    this.editProjectEvent.emit(this.project._id);
  }

  // Method to open the modal with project data
  openModal() {
    this.selectedProject = this.project; // Pass project data
    this.isModalOpen = true;
  }

  // Method to close the modal
  closeModal() {
    this.isModalOpen = false;
    this.selectedProject = null; // Clear the selected project
  }
}
