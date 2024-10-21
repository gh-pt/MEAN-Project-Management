import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QueryService } from '../service/query.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Query } from '../CustomClass/query';
import { Reply } from '../CustomClass/reply';
import { ToastrService } from 'ngx-toastr';


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
    private toastr: ToastrService
  ) {
    this.queryForm = this.fb.group({
      reply: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    // Get project ID
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
      const formData = { ...this.queryForm.value, userId: this.userId, };

      this.queryService.addReplyToQuery(this.id, formData).subscribe({
        next: (res) => {
          console.log('reply submitted successfully:', res);
          this.toastr.success('Reply submitted successfully');
          this.queryForm.reset();
          this.loadQueries();
        },
        error: (err) => {
          console.error('Error submitting query:', err);
        },
      });
    } else {
      console.log("Reply form invalid");
      this.toastr.error("Please enter the Reply Text.")
    }
  }
}
