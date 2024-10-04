import { Component } from '@angular/core';
import { Project } from '../CustomClass/project';
import { debounceTime, Subject } from 'rxjs';
import { ProjectService } from '../service/project.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  searchTerm: string = '';
  searchInput = new Subject<string>();

  constructor(private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.projectService.getProjects().subscribe((data: Project[]) => {
      this.projects = data;
      this.filteredProjects = [...this.projects]; // Initially display all products
    });
  }

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


  clearSearch() {
    this.searchTerm = ''; // Clear the search term
    this.filteredProjects = [...this.projects]; // Reset to show all products
  }

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
