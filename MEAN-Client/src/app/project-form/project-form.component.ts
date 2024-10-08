import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../service/project.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css'],
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() formSubmitEvent = new EventEmitter<any>();
  @Input() projectId: object | null = null;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private toastr: ToastrService
  ) {
    // Initialize the form with field names and validations
    this.projectForm = this.fb.group({
      ProjectName: ['', Validators.required],
      Details: ['', Validators.required],
      DemoLink: ['', [Validators.required, Validators.pattern('^https://.+')]],
      GithubRepository: ['', [Validators.required, Validators.pattern('^https://github\.com/.+')]],
    });
  }

  ngOnInit(): void {
    if (this.projectId) {
      this.loadProjectData(this.projectId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
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
        this.toastr.error(err.error.message);
      }
    });
  }

  // Method to close the modal
  closeFormModal() {
    this.closeModalEvent.emit();
  }

  // Method to submit form
  onSubmit() {
    if (this.projectForm.valid) {
      
      const Owner = JSON.parse(localStorage.getItem('user') || '{}').user._id;

      const formData = { ...this.projectForm.value, Owner };

      if (this.projectId) {
        // Update existing project 
        this.projectService.updateProject(this.projectId, formData).subscribe({
          next: (res) => {
            console.log('Project Successfully Updated', res);
            this.toastr.success('Project successfully updated!');
            this.formSubmitEvent.emit(res); // Emit the newly created project data
            this.closeFormModal();
          },
          error: (err) => {
            console.log('Error updating project:', err);
            this.toastr.error(err.error.message);
          }
        });
      } else {
        // Create new project if in create mode
        this.projectService.createProject(formData).subscribe({
          next: (res) => {
            console.log('Project Successfully Registered', res);
            this.toastr.success('Project successfully registered!');
            this.formSubmitEvent.emit(res); // Emit the newly created project data
            this.closeFormModal();
          },
          error: (err) => {
            console.log('Error registering project:', err);
            this.toastr.error(err.error.message);
          }
        });
      }
    } else {
      console.log('Form is invalid');
      this.toastr.error('Form is invalid All Fields are required');
    }
  }
}
