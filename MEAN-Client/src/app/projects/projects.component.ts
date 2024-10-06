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
      this.filteredProjects = [...this.projects];
    });
  }

  // Method to perform the search
  onSearch() {
    // No need for manual search filtering anymore
    if (!this.searchTerm) {
      this.filteredProjects = [...this.projects];
    }
  }

  // Clear the search box
  clearSearch() {
    this.searchTerm = '';
    this.filteredProjects = [...this.projects];
  }
}
