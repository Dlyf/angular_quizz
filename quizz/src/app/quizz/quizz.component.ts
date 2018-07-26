import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Category, Difficulty, Question, ClientAnswer } from '../data.interface';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})
export class QuizzComponent implements OnInit {
  // private dataService: DataService
  // message: string  = "Coucou";
  // fruits: string[] = ['Fraise', 'Vanille', 'Abricot'];
  // students: any[] = [];
  categories: Category[] = [];
  difficulties: Difficulty[] = [];
  questions: Question[] = [];
  // questions:

  selectCategory: number = 0;
  selectDifficulty: number = 0;
  nbQuestions: number = 10;

  isQcmReceived: boolean = false; // qcp reçu ou pas
  indexQuestion: number = 0;

  // tableau des réponses client
  client_answers: ClientAnswer[] = [];

  btnValidDisabled: boolean = true;

  constructor(private dataService: DataService) { }
  // this.dataService = new DataService;
  ngOnInit() {
    // console.log('ok');
    // this.students = this.dataService.test();
    // console.log(this.students);
    // this.dataService.test()
    //   .subscribe((res) => {
    //     this.students = res;
    //   })

    this.dataService.getCategories()
      .subscribe((res: Category[]) => {
        this.categories = res;
      });

    this.dataService.getDifficulties()
      .subscribe((res: Difficulty[]) => {
        this.difficulties = res;
      });
  }

  submit() {
    let params: string =
      `?cat=${this.selectCategory}&dif=${this.selectDifficulty}&nbq=${this.nbQuestions}`;

    // console.log(params);
    this.dataService.getQuizz(params)
      .subscribe((res: Question[]) => {
        this.isQcmReceived = true;
        this.questions = res;

        // console.log(res);
      })
  }

  validQuestion() {

    // envoi au serveur pour validation

    // passage à la question suivante

             // fin du formulaire (derniére question)
             // envoi  des réponses au serveur pour avalidation

    if (this.indexQuestion < this.questions.length-1) {
      this.indexQuestion++;
      // this.btnValidDisabled = true;
    } else {
      // fin du formulaire (denière questions)
      // envoi des réponses au serveur pour validation

      this.sendAnswers();

    }

    this.btnValidDisabled = true;

  }

  makeChoice(choice, choice_list, choice_list_item) {
    // console.log('exécution de makeChoice');


    // retrait de la classe selected sur l'élément précédemment sélectionné (nettoyage)
    // console.log(choice_list.length);
    let choices = choice_list.children; // enfants du ul => tableau de li

    for (let i:number = 0; i<choices.length; i++) {
      choices[i].classList.remove('selected');
    }
    // mise en forme de l'élément (choix) sélectionné
    choice_list_item.classList.add('selected');


    let qid    = this.questions[this.indexQuestion].id;
    let aid    = choice.id;
    let answer: ClientAnswer = {qid: qid, aid: aid};
    // console.log('Question: ' + qid + ' => Choix:' + aid);

    // à chaque clic sur une réponse = deux possibilités
    // 1) l'id de la question existe déjà dans le tableaux
    // et donc une réponse a déjà fourni, du coup, on la remplace
    // 2) l'id de la question n'existe pas, du coup, on l'ajoute

      if (this.client_answers.length == 0) {
        console.log('tableau vide, première insertion');
        this.client_answers.push(answer);
      }

      let qidx: number = this.isQuestionTreated(answer.qid);

      if (qidx == -1) {
        console.log('Question non traitée, pas de répose associée');
        // Ajout de la question/réponse dans le tableau des réponses clients
        this.client_answers.push(answer);
      } else {
        console.log('Question déjà traitée, mise à jour de la réponse associée');
        this.client_answers[qidx].aid = answer.aid;
      }
      // for (let i=0; i<this.client_answers.length; i++) {
      //   if (this.client_answers[i].qid == answer.qid) {
      //     // mise à jour
      //     console.log('mise à jour');
      //     this.client_answers[i].aid = answer.aid;
      //   } else {
      //     console.log('insertion');
      //     this.client_answers.push(answer);
      //   }
      // }


    console.log(this.client_answers);
    // bouton de validation devient actif
    this.btnValidDisabled = false;
  }

    // helpers
    // méthode déterminant si une question a déjà reçu une réponse
    isQuestionTreated(qid: number): number {
    for (let i:number=0; i<this.client_answers.length; i++) {
      // si trouvé, retourne la position (l'indice) de la question dans le tableau
      if (this.client_answers[i].qid == qid) return i;
    }
    return -1; // si l'id de la question n'a pas été trouvé
    // on retourne -1
  }

  sendAnswers() {

    // envoi des réponses au serveur via dataService
    this.dataService.postClientAnswers(this.client_answers)
      .subscribe((res) => {
        console.log(res);
      })
       console.log('Envoi de réponses');
   }
}
