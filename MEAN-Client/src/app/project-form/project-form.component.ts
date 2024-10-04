import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../service/project.service';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css'],
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  @Output() closeModalEvent = new EventEmitter<void>(); // To notify parent to close modal
  @Output() formSubmitEvent = new EventEmitter<any>(); // Emit updated project data after submission
  @Input() projectId: object | null = null;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService
  ) {
    // Initialize the form with field names and validations
    this.projectForm = this.fb.group({
      ProjectName: ['', Validators.required],
      Details: ['', Validators.required],
      DemoLink: ['', [Validators.required, Validators.pattern('http?://.+')]],
      GithubRepository: ['', [Validators.required, Validators.pattern('https?://.+')]],
    });
  }

  ngOnInit(): void {
    // Load project data if projectId is provided on component initialization
    if (this.projectId) {
      this.loadProjectData(this.projectId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // React to changes in the projectId input and load project data
    if (changes['projectId'] && this.projectId) {
      this.loadProjectData(this.projectId);
    }
  }

  // Method to load project data in edit mode
  loadProjectData(id: object) {
    this.projectService.getProjectById(id).subscribe({
      next: (project) => {
        this.projectForm.patchValue({
          ProjectName: project.ProjectName,
          Details: project.Details,
          DemoLink: project.DemoLink,
          GithubRepository: project.GithubRepository,
        });
        console.log('Project data loaded for edit:', project);
      },
      error: (err) => {
        console.log('Error loading project data:', err);
        window.alert('Failed to load project data.');
      }
    });
  }

  // Method to close the modal
  closeFormModal() {
    this.closeModalEvent.emit();
  }

  // Method to handle form submission (create or update)
  onSubmit() {
    if (this.projectForm.valid) {
      // Retrieve owner from localStorage
      const Owner = JSON.parse(localStorage.getItem('user') || '{}').user._id;

      // Merge the owner field into the form value
      const formData = { ...this.projectForm.value, Owner };

      if (this.projectId) {
        // Update existing project if in edit mode
        this.projectService.updateProject(this.projectId, formData).subscribe({
          next: (res) => {
            console.log('Project Successfully Updated', res);
            window.alert('Project Successfully Updated');
            this.formSubmitEvent.emit(res); // Emit the updated project data
            this.closeFormModal(); // Close the form modal after update
          },
          error: (err) => {
            console.log('Error updating project:', err);
            window.alert('Something went wrong while updating the project...');
          }
        });
      } else {
        // Create new project if in create mode
        this.projectService.createProject(formData).subscribe({
          next: (res) => {
            console.log('Project Successfully Registered', res);
            window.alert('Project Successfully Registered');
            this.formSubmitEvent.emit(res); // Emit the newly created project data
            this.closeFormModal(); // Close the form modal after creation
          },
          error: (err) => {
            console.log('Error registering project:', err);
            window.alert('Something went wrong while Registering...');
          }
        });
      }
    } else {
      console.log('Form is invalid');
    }
  }
}
