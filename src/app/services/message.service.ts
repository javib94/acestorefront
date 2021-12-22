
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class MessageService {
  
  constructor(private _http: HttpClient) { }

  sendMessage(body: object) {
     return this._http.post('https://www.aceelectronicos.tk/formulario', body, {responseType: 'text'});
  }

  getBannerImages(){
    return this._http.get('https://www.aceelectronicos.tk/banner');  
  }
   
}