import { Component } from '@angular/core';
import { ProjectService } from '../service/project.service';
import { Project } from '../CustomClass/project';

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
    if (this.searchTerm) {
      // Call the API to perform the search
      const obs = this.projectService.searchProducts(this.searchTerm);
      obs.subscribe({
        next: (project) => {
          this.filteredProjects = project;
        },
        error: (err) => {
          console.log(err)
        }
      });
    } else {
      this.filteredProjects = [...this.projects]; // Show all projects if the search term is cleared
    }
  }

  constructor(private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  // Method to load projects
  loadProjects(): void {
    if (this.user) {
      const userId = JSON.parse(this.user)?.user?._id;
      console.log(userId)

      this.projectService.getProductByOwner(userId).subscribe((data: Project[]) => {
        this.projects = data;
        this.filteredProjects = [...this.projects]; // Initially display all products
      })
    };
  }

  // Method to clear the search
  clearSearch() {
    this.searchTerm = ''; // Clear the search term
    this.filteredProjects = [...this.projects]; // Reset to show all products
  }

  // Method to delete a project
  deleteProject(id: object): void {
    const ans = confirm('Do you really want to delete?');
    if (ans) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          alert('Product deleted successfully.');
          this.filteredProjects = this.filteredProjects.filter(p => p._id !== id);
        },
        error: (err) => {
          console.log(err);
          alert('Something went wrong while deleting the product.');
        }
      });
    }
  }

}
