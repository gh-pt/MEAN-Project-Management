import { Pipe, PipeTransform } from '@angular/core';
import { Project } from '../CustomClass/project';

@Pipe({
  name: 'searchProject',
  pure: false
})
export class SearchProjectPipe implements PipeTransform {

  transform(projects: Project[], searchTerm: string): Project[] {
    if (!projects || !searchTerm) {
      return projects;
    }

    // Convert search term to lowercase 
    searchTerm = searchTerm.toLowerCase();

    // Filter projects based on the project name
    return projects.filter(project =>
      project.ProjectName.toLowerCase().includes(searchTerm)
    );
  }

}
