import { Component } from '@angular/core';
import { ProjectService } from '../service/project.service';
import { Project } from '../CustomClass/project';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  searchTerm: string = '';
  isFormModalOpen = false;
  selectedProjectId: object | null = null;
  // User data
  user = localStorage.getItem('user');

  // Method to Open Modal
  openFormModal() {
    this.isFormModalOpen = true;
  }

  // Method to open the form modal for editing a project
  openEditForm(projectId: object) {
    this.selectedProjectId = projectId;
    this.isFormModalOpen = true;
  }

  // Method to close the form modal
  closeFormModal() {
    this.isFormModalOpen = false;
    this.selectedProjectId = null;
  }

  // Method to handle form submission and update the projects list
  handleFormSubmit(updatedProject: Project) {
    this.loadProjects()
  }

  // Method to perform the search
  onSearch() {
    if (!this.searchTerm) {
      this.filteredProjects = [...this.projects];
    }
  }


  constructor(private projectService: ProjectService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  // Method to load projects
  loadProjects(): void {
    if (this.user) {
      const userId = JSON.parse(this.user)?.user?._id;
      this.projectService.getProductByOwner(userId).subscribe((data: Project[]) => {
        this.projects = data;
        this.filteredProjects = [...this.projects];
      })
    };
  }

  // Method to clear the search
  clearSearch() {
    this.searchTerm = '';
    this.filteredProjects = [...this.projects];
  }

  // Method to delete a project
  deleteProject(id: object): void {
    const ans = confirm('Do you really want to delete?');
    if (ans) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.toastr.success('Project deleted successfully');
          this.filteredProjects = this.filteredProjects.filter(p => p._id !== id);
        },
        error: (err) => {
          console.log(err);
          this.toastr.error(err.error.message);
        }
      });
    }
  }

}
