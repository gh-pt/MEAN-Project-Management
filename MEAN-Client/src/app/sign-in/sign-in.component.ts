import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../service/user.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  SignInForm: FormGroup;
  flag = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private UserService: UserService
  ) {
    this.SignInForm = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, {
      validator: this.matchPassword('Password', 'repeatPassword')
    });
  }

  matchPassword(password: string, repeatPassword: string) {
    return (formGroup: FormGroup) => {
      const passControl = formGroup.controls[password];
      const confirmPassControl = formGroup.controls[repeatPassword];

      if (confirmPassControl.errors && !confirmPassControl.errors['passwordMismatch']) {
        return;
      }

      if (passControl.value !== confirmPassControl.value) {
        confirmPassControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPassControl.setErrors(null);
      }
    };
  }

  onSubmit(): void {
    if (this.SignInForm.invalid) {
      return;
    }

    const { Email, Password } = this.SignInForm.value;

    const signInData = { Email, Password };

    console.log(signInData);
    const obs = this.UserService.signIn(signInData)
    obs.subscribe({
      next: (res) => {
        console.log(`User Succesfully SignedIn`, res);
        window.alert(`User Succesfully SignedIn`);
        localStorage.setItem("isLogin", "true")
        localStorage.setItem("user", JSON.stringify(res))
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.log(err);
        window.alert("Something went wrong while SigIn...");
      }

    }
    );
  }
}
