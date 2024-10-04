import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QueryService } from '../service/query.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Query } from '../CustomClass/query';
import { Reply } from '../CustomClass/reply';


@Component({
  selector: 'app-reply-query',
  templateUrl: './reply-query.component.html',
  styleUrls: ['./reply-query.component.css'],
})
export class ReplyQueryComponent implements OnInit {
  query!: Query;
  replies: Reply[] = [];
  isLoading = true;
  route: string | undefined = '';
  id: object | string = '';
  userId: string | null = null;
  queryForm: FormGroup;
  queryText: string = '';

  constructor(
    private activeRoute: ActivatedRoute,
    private queryService: QueryService,
    private fb: FormBuilder,
  ) {
    // Initialize the form group with a validation rule for the query field
    this.queryForm = this.fb.group({
      reply: ['', [Validators.required, Validators.minLength(10)]],
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
    this.queryService.getQueryById(this.id).subscribe({
      next: (data: any) => {
        this.query = data;
        this.queryText = data.query;
        this.replies = data.replies;
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
      const formData = { ...this.queryForm.value, userId: this.userId, };

      console.log(formData)
      // Call the service to submit the query with FormData
      this.queryService.addReplyToQuery(this.id, formData).subscribe({
        next: (res) => {
          console.log('reply submitted successfully:', res);
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
