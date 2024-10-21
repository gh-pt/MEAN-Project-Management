import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  signupForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private UserService: UserService,
    private toastr: ToastrService
  ) {
    this.signupForm = this.formBuilder.group({
      Username: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Contact: ['', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      ConfirmPassword: ['', Validators.required],
      ProfileImage: [null, Validators.required],
      terms: [false, Validators.requiredTrue]
    }, { validator: this.passwordMatchValidator });
  }

  // Method to match the password and confirm password
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('Password')?.value;
    const confirmPassword = formGroup.get('ConfirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {

    if (this.signupForm.valid) {

      const formData = new FormData();
      formData.append('Username', this.signupForm.get('Username')?.value);
      formData.append('Email', this.signupForm.get('Email')?.value);
      formData.append('Contact', this.signupForm.get('Contact')?.value);
      formData.append('Password', this.signupForm.get('Password')?.value);
      formData.append('ConfirmPassword', this.signupForm.get('ConfirmPassword')?.value);

      // Handle file upload
      const fileInput = this.signupForm.get('ProfileImage')?.value;
      if (fileInput) {
        formData.append('ProfileImage', fileInput);
      }

      // Reset error message
      this.errorMessage = '';

      const obs = this.UserService.registerUser(formData);
      obs.subscribe({
        next: (res) => {
          console.log(`User Successfully Registered`, res);
          this.toastr.success('User Successfully Registered');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          // Handle backend errors and set appropriate error messages
          if (err.status === 409) {
            this.errorMessage = "User with this email or username already exists.";
          } else if (err.status === 400) {
            this.errorMessage = "Bad request. Please check the entered details.";
          } else if (err.status === 500) {
            this.errorMessage = "Server error. Please try again later.";
          } else {
            this.errorMessage = "Something went wrong while registering.";
          }
          console.log(err);
        }
      });
    } else {
      this.errorMessage = "Please fill out all required fields correctly.";
    }
  }

  // Handle file input
  onFileChange(event: any) {
    const file = event.target.files[0];
    this.signupForm.patchValue({
      ProfileImage: file
    });
  }
}
