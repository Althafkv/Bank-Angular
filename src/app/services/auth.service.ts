import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // islogggedIn
  isLoggedin(){
    return !!localStorage.getItem("token")
  }
}
