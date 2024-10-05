import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  SignInForm: FormGroup;
  errorMessage: string | null = null; // To store error messages

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private UserService: UserService
  ) {
    this.SignInForm = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.SignInForm.invalid) {
      return;
    }

    const signInData = this.SignInForm.value;
    this.errorMessage = null;  // Reset error message before making the request

    console.log(signInData);
    const obs = this.UserService.signIn(signInData);
    obs.subscribe({
      next: (res) => {
        console.log(`User Successfully Signed In`, res);
        window.alert(`User Successfully Signed In`);
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("user", JSON.stringify(res));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.log(err);
        // Display a custom error message based on the error status and message
        if (err.status === 404) {
          this.errorMessage = "User not found. Please check your email or username.";
        } else if (err.status === 400) {
          this.errorMessage = err.error.message || "Invalid credentials. Please try again.";
        } else {
          this.errorMessage = "Something went wrong. Please try again later.";
        }
      }
    });
  }
}
