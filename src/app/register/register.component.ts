import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { ToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  // form group
  registerForm = this.fb.group({
    // form array
    username:['',[Validators.required,Validators.minLength(2),Validators.pattern('[a-zA-Z ]*')]],
    acno:['',[Validators.required,Validators.pattern('[0-9]*')]],
    password:['',[Validators.required,Validators.pattern('[a-zA-Z0-9]*')]]
  })

  constructor(private fb:FormBuilder,private api:ApiService,private toaster:ToasterService,private joinRouter:Router){
  }

  register(){
    
    if(this.registerForm.valid){
      // form valid
      // get inputs
      let username = this.registerForm.value.username
      let acno = this.registerForm.value.acno
      let pswd = this.registerForm.value.password

      // register api call in service
      this.api.register(username,acno,pswd).subscribe({
        next:(response:any)=>{
          console.log(response);
          this.toaster.showSuccess(`${response.username} Successfully Registered`,'Success')
          // navigate to login page
          setTimeout(()=>{
            this.joinRouter.navigateByUrl('indian-bank/login')
          },2000)
        },
        error:(err:any)=>{
          console.log(err);
          this.toaster.showError(`${err.error}`,'Fail')
          
        }
      })
      
    }else{
      // form invalid
      this.toaster.showWarning("Invalid Form",'Warning')
    }
  }

}
