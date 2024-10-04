import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QueryService } from '../service/query.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Query } from '../CustomClass/query';
import { ProjectService } from '../service/project.service';

@Component({
  selector: 'app-project-query',
  templateUrl: './project-query.component.html',
  styleUrls: ['./project-query.component.css'],
})
export class ProjectQueryComponent implements OnInit {
  queries: Query[] = [];
  isLoading = true;
  route: string | undefined = '';
  id: object | string = '';
  userId: string | null = null;
  queryForm: FormGroup;

  constructor(
    private activeRoute: ActivatedRoute,
    private queryService: QueryService,
    private projectService: ProjectService,
    private fb: FormBuilder,
  ) {
    // Initialize the form group with a validation rule for the query field
    this.queryForm = this.fb.group({
      query: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    // Get project ID from route params
    this.route = this.activeRoute.snapshot.routeConfig?.path;
    const routeParam = this.activeRoute.snapshot.paramMap.get('id');
    if (routeParam != null) {
      this.id = routeParam;
      this.loadQueries();
    }

    // Get userId from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      this.userId = JSON.parse(user).user._id;
    }
    console.log(this.userId)
  }

  // Method to load project queries
  loadQueries() {
    this.queryService.getQueriesByProject(this.id).subscribe({
      next: (data: any) => {
        this.queries = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading queries:', err);
        this.isLoading = false;
      },
    });
  }


  // Handle form submission
  onSubmit() {
    if (this.queryForm.valid && this.userId) {
      // Prepare form data
      const formData = { ...this.queryForm.value, projectId: this.id, userId: this.userId, };

      console.log(formData)
      // Call the service to submit the query with FormData
      this.queryService.addQuery(formData).subscribe({
        next: (res) => {
          console.log('Query submitted successfully:', res);
          this.queryForm.reset();
          this.loadQueries();
        },
        error: (err) => {
          console.error('Error submitting query:', err);
        },
      });
    }
  }
}
