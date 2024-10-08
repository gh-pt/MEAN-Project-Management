import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QueryService } from '../service/query.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Query } from '../CustomClass/query';

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
    private fb: FormBuilder,
  ) {
    this.queryForm = this.fb.group({
      query: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    // get the route param
    this.route = this.activeRoute.snapshot.routeConfig?.path;
    const routeParam = this.activeRoute.snapshot.paramMap.get('id');
    if (routeParam != null) {
      this.id = routeParam;
      this.loadQueries();
    }


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

      const formData = { ...this.queryForm.value, projectId: this.id, userId: this.userId, };

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
