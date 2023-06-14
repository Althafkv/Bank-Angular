import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToasterService } from '../services/toaster.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  handleTransfer:boolean = true
  transferSuccessMsg:string = ""
  transferFailMsg:string = ""
  balance:number = 0
  showOffcanvas:boolean = true
  isCollapse:boolean = true
  user:string = ""

  // transferform
  transferForm = this.fb.group({
    creditAcno:["",[Validators.required,Validators.pattern("[0-9]*")]],
    creditAmount:["",[Validators.required,Validators.pattern("[0-9]*")]],
    profilePswd:["",[Validators.required,Validators.pattern("[a-zA-Z0-9]*")]]
  })


  constructor(private fb:FormBuilder,private api:ApiService,private toaster:ToasterService,private router:Router){

  }
  ngOnInit(): void {
    // get username from localstorage
    this.user = localStorage.getItem("loginUsername") || ""
  }



  collapse(){
    this.isCollapse=!this.isCollapse
  }

  // get balance
  getBalance(){
    // get loginuserAcno from localstorage
    let acno = localStorage.getItem("loginUserAcno")
    // call balance fn of service
    this.api.balanceEnquiry(acno).subscribe({
      next:(res:any)=>{
        console.log(res);
        this.balance = res
      },
      error:(err:any)=>{
        this.showOffcanvas = false
        console.log(err.error);
        this.toaster.showError(err.error,"Fail")
      }
    })
  }

  // transfer
  transfer(){
    // validate form
    if(this.transferForm.valid){
      // get input values from fundtransfer
      let creditAcno = this.transferForm.value.creditAcno
      let creditAmount = this.transferForm.value.creditAmount
      let profilePswd = this.transferForm.value.profilePswd

      // make call to service
      this.api.fundTransfer(creditAcno,creditAmount,profilePswd).subscribe({
        next:(response:any)=>{
          console.log(response);
          this.transferSuccessMsg = response
          this.handleTransfer = false
          setTimeout(() => {
            this.transferSuccessMsg = ""
            this.handleTransfer = true
            this.transferForm.reset()
          }, 5000);
        },
        error:(err:any)=>{
          console.log(err.error);
          this.transferFailMsg = err.error
          this.handleTransfer = false
          setTimeout(() => {
            this.transferFailMsg = ""
            this.handleTransfer = true
            this.transferForm.reset()
          }, 3000);
          
        }
      })
      

    }else{
      this.toaster.showWarning("Invalid Form",'Warning')
    }
  }

  // cancel transfer btn
  cancel(){
    this.transferSuccessMsg = ""
    this.transferFailMsg = ""
    this.transferForm.reset()
  }

  // deleteMyAcno
  deleteMyAcno(){
    // make a call to service
    this.api.deleteAcno().subscribe({
      next:(res:any)=>{
        console.log(res);
        // alert res
        this.toaster.showWarning(res,"Warning")
        this.logout()
        
      },
      error:(err:any)=>{
        console.log(err);
        
      }
    })
  }

  // logout
  logout(){
    // remove login data from localStorage
    localStorage.removeItem("loginUsername")
    localStorage.removeItem("token")
    localStorage.removeItem("loginUserAcno")
    // redirect to landing page
    setTimeout(() => {
      this.router.navigateByUrl('')
    }, 1000);
  }

}
