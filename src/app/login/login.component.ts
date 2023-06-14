import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ToasterService } from '../services/toaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // loading spinner
  isLoading:boolean = false

  // form group
  loginForm = this.fb.group({
    // form array
    acno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    password: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]]
  })

  constructor(private fb: FormBuilder, private api: ApiService,private toaster:ToasterService,private joinRouter:Router) {
  }

  login() {

    if (this.loginForm.valid) {
      // form valid
      // get input
      let acno = this.loginForm.value.acno
      let pswd = this.loginForm.value.password

      // set loading to true
      this.isLoading = true

      // login api call in service
      this.api.login(acno,pswd).subscribe({
        next:(res:any)=>{
          // res destructure to preuser and token
          const { preuser,token } = res 

          // store username in localstorage
          localStorage.setItem("loginUsername",preuser.username)
          // store acno in localstorage
          localStorage.setItem("loginUserAcno",preuser.acno)
          // store token in localstorage
          localStorage.setItem("token",token)

          setTimeout(() => {
            // set isLoading to false
            this.isLoading = false
            // success notification
            this.toaster.showSuccess(`Welcome ${preuser.username}`,'Success')
            // redirect to dashboard
            this.joinRouter.navigateByUrl('user/dashboard')
          }, 2000);

          
        },
        error:(err:any)=>{
          console.log(err.error);
          this.toaster.showError(`${err.error}`,'Fail')
          this.isLoading = false

          
        }
      })




    } else {
      this.toaster.showWarning('Invalid Text','Warning')
    }
  }

}
