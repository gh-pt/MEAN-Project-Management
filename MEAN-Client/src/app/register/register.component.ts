import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  signupForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private UserService: UserService
  ) {
    this.signupForm = this.formBuilder.group({
      Username: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Contact: ['', [Validators.required, Validators.maxLength(10)]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      ConfirmPassword: ['', Validators.required],
      ProfileImage: [null],
      terms: [false, Validators.requiredTrue]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('Password')?.value;
    const confirmPassword = formGroup.get('ConfirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      return;
    }

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

    console.log(formData);
    const obs = this.UserService.registerUser(formData);
    obs.subscribe({
      next: (res) => {
        console.log(`User Successfully Registered`, res);
        window.alert(`User Successfully Registered`);
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("user", JSON.stringify(res));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.log(err);
        window.alert("Something went wrong while Registering...");
      }
    });
  }

  // Handle file input
  onFileChange(event: any) {
    const file = event.target.files[0];
    this.signupForm.patchValue({
      ProfileImage: file
    });
  }
}
