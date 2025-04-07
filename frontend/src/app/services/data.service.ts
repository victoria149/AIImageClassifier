import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Prediction } from '../model/prediction';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  url = 'http://127.0.0.1:5000'; 

  httpClient = inject(HttpClient);
  
  constructor() { }

  predictImage(image: File): Observable<Prediction> {
    const formData = new FormData();
    formData.append('file', image);

    return this.httpClient.post<Prediction>(`${this.url}/predict`, formData);
  }
}
