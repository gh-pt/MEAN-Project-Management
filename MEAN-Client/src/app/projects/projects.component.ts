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

  // Method to load products
  loadProducts(): void {
    this.projectService.getProjects().subscribe((data: Project[]) => {
      this.projects = data;
      this.filteredProjects = [...this.projects]; // Initially display all products
    });
  }

  // Method to perform the search
  onSearch() {
    if (this.searchTerm) {
      // Call the API to perform the search
      const obs = this.projectService.searchProducts(this.searchTerm);
      obs.subscribe({
        next: (project) => {
          // Check if the returned project is null or contains only null values
          if (project && project.length > 0 && project[0] !== null) {
            this.filteredProjects = project;
          } else {
            this.filteredProjects = []; // Set to empty array if no results
          }
        },
        error: (err) => {
          console.log(err)
        }
      });
    } else {
      this.filteredProjects = [...this.projects]; // Show all projects if the search term is cleared
    }
  }

  // Clear the search box
  clearSearch() {
    this.searchTerm = ''; // Clear the search term
    this.filteredProjects = [...this.projects]; // Reset to show all products
  }
}
