import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService, ConfirmationService } from 'primeng/api';
import { first } from 'rxjs/operators';
import { QuestionService } from 'src/app/_services/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  surveyId: number;
  displayEdit: boolean = false;
  displayAdd: boolean = false;
  formAdd: FormGroup;
  formEdit: FormGroup;
  questionTypes: any;
  questions: any;
  id_Edit = 0;
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private questionService: QuestionService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.surveyId = params["id"];
      this.loadData();
    });

    this.formAdd = this.fb.group({
      Name: this.fb.control('', [Validators.required]),
      Description: this.fb.control(''),
      SurveyId: this.fb.control(this.surveyId, [Validators.required]),
      QuestionTypeId: this.fb.control('', [Validators.required]),
    });
    this.formEdit = this.fb.group({
      Name: this.fb.control('', [Validators.required]),
      Description: this.fb.control(''),
      QuestionTypeId: this.fb.control('', [Validators.required])
    });

    this.loadQuestionTypes();
    console.log(this.surveyId);
  }
  loadData(): void {
    this.spinner.show();
    this.questionService
      .getBySurveyId(this.surveyId)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.questions = res;
          this.spinner.hide();
        },
        error: (err) => {
          this.spinner.hide();
          this.messageService.add({
            severity: 'error',
            summary: 'Th??ng b??o',
            detail: `???? c?? l???i !`,
          });
        },
      });
  }

  loadQuestionTypes(): void {
    setTimeout(() => {
      this.questionService
        .getAllQuestionTypes()
        .pipe(first())
        .subscribe({
          next: (res) => {
            this.questionTypes = res;
          },
          error: (err) => {
            this.spinner.hide();
            this.messageService.add({
              severity: 'error',
              summary: 'Th??ng b??o',
              detail: `???? c?? l???i !`,
            });
          },
        });
    }, 300);
  }

  onAdd(): void {
    //console.log(this.formAdd.value);
    this.questionService
      .add(this.formAdd.value)
      .pipe(first())
      .subscribe({
        next: (res: any) => {
          if (res !== null) {
            this.messageService.add({
              severity: 'success',
              summary: 'Th??ng b??o',
              detail: 'Th??m th??nh c??ng !',
            });
            this.displayAdd = false;
            this.clearModalAdd();
            this.loadData();
          }
        },
        error: (err: any) => {
          if (err.error.StatusCode === 400) {
            this.messageService.add({
              severity: 'error',
              summary: 'Th??ng b??o',
              detail: err.error.Message,
            });
          }
          else if (err.error.StatusCode === 500) {
            this.messageService.add({
              severity: 'error',
              summary: 'Th??ng b??o',
              detail: '???? c?? l???i h??? th???ng',
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Th??ng b??o',
              detail: `???? c?? l???i !`,
            });
          }
        },
      });
  }

  onGetEdit(id: any): void {
    this.spinner.show();
    this.questionService
      .getById(id)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.displayEdit = true;
          this.id_Edit = res.Id;
          this.formEdit = this.fb.group({
            Name: this.fb.control(res.Name, [Validators.required]),
            Description: this.fb.control(res.Description),
            QuestionTypeId: this.fb.control(res.QuestionTypeId, [Validators.required])
          });
          this.spinner.hide();
        },
        error: (err) => {
          if (err.error.StatusCode === 404) {
            this.messageService.add({
              severity: 'error',
              summary: 'Th??ng b??o',
              detail: err.error.Message,
            });
          }
          else {
            this.messageService.add({
              severity: 'error',
              summary: 'Th??ng b??o',
              detail: `???? c?? l???i !`,
            });
          }
          this.spinner.hide();
        },
      });
  }
  onEdit(): void {
    if (this.id_Edit > 0) {
      this.questionService
        .update(this.id_Edit, this.formEdit.value)
        .pipe(first())
        .subscribe({
          next: (res) => {
            if (res !== null) {
              this.messageService.add({
                severity: 'success',
                summary: 'Th??ng b??o',
                detail: 'C???p nh???t th??nh c??ng !',
              });
              this.displayEdit = false;
              this.loadData();
            }
          },
          error: (err) => {
            if (err.error.StatusCode === 400) {
              this.messageService.add({
                severity: 'error',
                summary: 'Th??ng b??o',
                detail: err.error.Message,
              });
            }
            else if (err.error.StatusCode === 500) {
              this.messageService.add({
                severity: 'error',
                summary: 'Th??ng b??o',
                detail: '???? c?? l???i h??? th???ng',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Th??ng b??o',
                detail: `???? c?? l???i !`,
              });
            }
          },
        });
    }
  }
  clearModalAdd() {
    this.formAdd = this.fb.group({
      Name: this.fb.control('', [Validators.required]),
      Description: this.fb.control(''),
      SurveyId: this.fb.control(this.surveyId, [Validators.required]),
      QuestionTypeId: this.fb.control('', [Validators.required]),
    });
  }
  onDelete(id: any) {
    this.confirmationService.confirm({
      header: 'Xo?? kh???o s??t ?',
      message: 'B???n c?? ch???c ch???n xo?? ?',
      accept: () => {
        this.questionService
          .delete(id)
          .pipe(first())
          .subscribe({
            next: (res) => {
              //console.log(res);
              if (res !== null) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Th??ng b??o',
                  detail: '???? xo?? th??nh c??ng !',
                });
                this.loadData();
              }
            },
            error: (err) => {
              if (err.error.StatusCode === 404) {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Th??ng b??o',
                  detail: err.error.Message,
                });
              }
              else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Th??ng b??o',
                  detail: `???? c?? l???i !`,
                });
              }
            },
          });
      },
    });
  }

}
