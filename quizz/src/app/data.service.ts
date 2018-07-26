import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClientAnswer } from './data.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private api: string = 'http://localhost:8000/api';
  // Injection du service Http afin de réaliser des requêtes Ajax
  constructor(private http: HttpClient) { }

  // test() {
  //   console.log('test depuis DataService');
  //
  //   // .get renvoie un objet de type Observable (Rxjs)
  //   // this.http
  //     // .get(this.api)
  //     // // .subscribe(function () {
  //     // //
  //     // // }
  //     // .subscribe((res) => {
  //     //   return 'ciao';
  //     // });
  //
  //     // return 'salut'
  //     return this.http.get(this.api);
  //
  //     // On ne souscrit pas au niveau du service
  // }

  getCategories() {
    return this.http.get(this.api + '/category');
  }

  getDifficulties() {
    return this.http.get(this.api + '/difficulty');
  }

  getQuizz(params: string) {
    return this.http.get(this.api + '/quizz' + params);
  }

  postClientAnswers(client_answers: ClientAnswer[]) {
    // transformation en JSON du tbleau client_answers
    let json
    return this.http.post(this.api + '/quizz_answers', {answers:client_answers});
  }
}
