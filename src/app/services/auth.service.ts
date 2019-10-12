import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import {tokenNotExpired} from 'angular2-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

   authToken: any;
   user: any;

  constructor(private http: HttpClient) { }

    registerUser(user){
     let headers = new HttpHeaders();
      headers.append('Content-Type','application/json');
      return this.http.post('http://localhost:3000/users/register', user , {headers: headers})
      .map(res => res);
    }

    authenticateUser(user):Observable<any>{
      let headers = new HttpHeaders();
      headers.append('Content-Type','application/json');
      return this.http.post('http://localhost:3000/users/authenticate', user , {headers: headers})
      .map(res => res);

    }

    getProfile():Observable<any>{
      let headers = new HttpHeaders();
      this.loadToken();
      headers.append('Authorization', this.authToken);
      headers.append('Content-Type','application/json');
      return this.http.get('http://localhost:3000/users/profile',{headers: headers})
      .map(res => res);

    }

    storeUserDate(token, user){
      localStorage.setItem('id_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      this.authToken = token;
      this.user = user;
    }

    loadToken(){
      const token = localStorage.getItem('id_token');
      this.authToken = token;
    }

    loggedIn(){
      return tokenNotExpired();
    }

    logout(){
      this.authToken = null;
      this.user = null;
      localStorage.clear();
    }

    
 
    
  }


