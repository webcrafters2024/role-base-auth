import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../core/service/api.service';
import { environment } from '../../../environments/environment';
import { CommonService } from '../../core/service/common.service';
import { LoginService } from '../../core/service/login.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {


  isLoading: boolean = false;


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
    private loginService : LoginService,
    
  ) {


  }

  ngOnInit(): void {




  }





  onSubmit() {
    this.isLoading = true;
    if (this.formGroup.invalid) {
      this.isLoading = false;
      for (const control of Object.keys(this.formGroup.controls) as (keyof typeof this.formGroup.controls)[]) {
        this.formGroup.controls[control].markAsTouched();
      }
      return;
    }


    this.apiService.apiPost('api/user/login', this.formGroup.value).subscribe((res) => {
      if (res) {
        this.loginService.setUserAndToken(res)
      }

    })




  }










}
