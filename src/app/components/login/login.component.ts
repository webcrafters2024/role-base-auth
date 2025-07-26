import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../core/service/api.service';
import { LoginService } from '../../core/service/login.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  // Indicates if the login request is in progress
  isLoading: boolean = false;

  // Reactive form group for login form
  formGroup = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', [
      Validators.required,
    ]),
  })

  constructor(
    private apiService: ApiService,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {

  }

  // Handles form submission for login
  onSubmit() {
    this.isLoading = true;
    if (this.formGroup.invalid) {
      this.isLoading = false;
      // Mark all controls as touched to trigger validation messages
      for (const control of Object.keys(this.formGroup.controls) as
        (keyof typeof this.formGroup.controls)[]) {
        this.formGroup.controls[control].markAsTouched();
      }
      return;
    }

    // Call login API and handle response
    this.apiService.apiPost('api/user/login', this.formGroup.value).subscribe((res) => {
      debugger
      if (res.successCode === 1) {
        // Store user and token after successful login
        this.loginService.setUserAndToken(res.result)
        this.isLoading = false;
      }
    }, (err) => {
      this.isLoading = false;
    }
    )
  }

}