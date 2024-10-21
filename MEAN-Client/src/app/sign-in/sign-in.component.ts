import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  SignInForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private UserService: UserService,
    private toastr: ToastrService
  ) {
    this.SignInForm = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.SignInForm.valid) {
      const signInData = this.SignInForm.value;
      this.errorMessage = null;

      console.log(signInData);
      const obs = this.UserService.signIn(signInData);
      obs.subscribe({
        next: (res) => {
          console.log(`User Successfully Signed In`, res);
          this.toastr.success('User Successfully Signed In');
          localStorage.setItem("isLogin", "true");
          localStorage.setItem("user", JSON.stringify(res));
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.log(err);
          // Display a custom error message 
          if (err.status === 404) {
            this.errorMessage = "User not found. Please check your email or username.";
          } else if (err.status === 400) {
            this.errorMessage = err.error.message || "Invalid credentials. Please try again.";
          } else {
            this.errorMessage = "Something went wrong. Please try again later.";
          }
        }
      });
    } else {
      console.log("invalid")
      this.errorMessage = "Please fill out all required fields correctly."
    }
  }
}
