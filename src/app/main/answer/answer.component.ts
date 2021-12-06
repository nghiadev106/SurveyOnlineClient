import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService, ConfirmationService } from 'primeng/api';
import { first } from 'rxjs/operators';
import { AnswerService } from 'src/app/_services/answer.service';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css']
})
export class AnswerComponent implements OnInit {
  questionId: number;
  surveyId: number;
  displayEdit: boolean = false;
  displayAdd: boolean = false;
  formAdd: FormGroup;
  formEdit: FormGroup;
  answerTypes: any;
  answers: any;
  id_Edit = 0;
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private answerService: AnswerService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.questionId = params["questionId"];
      this.surveyId = params["surveyId"];
      this.loadData();
    });

    this.formAdd = this.fb.group({
      Content: this.fb.control('', [Validators.required]),
      QuestionId: this.fb.control(this.questionId, [Validators.required]),
    });
    this.formEdit = this.fb.group({
      Content: this.fb.control('', [Validators.required]),
    });
  }
  loadData(): void {
    this.spinner.show();
    this.answerService
      .getByQuestionId(this.questionId)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.answers = res;
          this.spinner.hide();
        },
        error: (err) => {
          this.spinner.hide();
          this.messageService.add({
            severity: 'error',
            summary: 'Thông báo',
            detail: `Đã có lỗi !`,
          });
        },
      });
  }

  onAdd(): void {
    //console.log(this.formAdd.value);
    this.answerService
      .add(this.formAdd.value)
      .pipe(first())
      .subscribe({
        next: (res: any) => {
          if (res !== null) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thông báo',
              detail: 'Thêm thành công !',
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
              summary: 'Thông báo',
              detail: err.error.Message,
            });
          }
          else if (err.error.StatusCode === 500) {
            this.messageService.add({
              severity: 'error',
              summary: 'Thông báo',
              detail: 'Đã có lỗi hệ thống',
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Thông báo',
              detail: `Đã có lỗi !`,
            });
          }
        },
      });
  }

  onGetEdit(id: any): void {
    this.spinner.show();
    this.answerService
      .getById(id)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.displayEdit = true;
          this.id_Edit = res.Id;
          this.formEdit = this.fb.group({
            Content: this.fb.control(res.Content, [Validators.required]),
            QuestionId: this.fb.control(res.QuestionId, [Validators.required]),
          });
          this.spinner.hide();
        },
        error: (err) => {
          if (err.error.StatusCode === 404) {
            this.messageService.add({
              severity: 'error',
              summary: 'Thông báo',
              detail: err.error.Message,
            });
          }
          else {
            this.messageService.add({
              severity: 'error',
              summary: 'Thông báo',
              detail: `Đã có lỗi !`,
            });
          }
          this.spinner.hide();
        },
      });
  }
  onEdit(): void {
    if (this.id_Edit > 0) {
      this.answerService
        .update(this.id_Edit, this.formEdit.value)
        .pipe(first())
        .subscribe({
          next: (res) => {
            if (res !== null) {
              this.messageService.add({
                severity: 'success',
                summary: 'Thông báo',
                detail: 'Cập nhật thành công !',
              });
              this.displayEdit = false;
              this.loadData();
            }
          },
          error: (err) => {
            if (err.error.StatusCode === 400) {
              this.messageService.add({
                severity: 'error',
                summary: 'Thông báo',
                detail: err.error.Message,
              });
            }
            else if (err.error.StatusCode === 500) {
              this.messageService.add({
                severity: 'error',
                summary: 'Thông báo',
                detail: 'Đã có lỗi hệ thống',
              });

            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Thông báo',
                detail: `Đã có lỗi !`,
              });
            }
          },
        });
    }
  }
  clearModalAdd() {
    this.formAdd = this.fb.group({
      Content: this.fb.control('', [Validators.required]),
      QuestionId: this.fb.control(this.questionId, [Validators.required]),
    });
  }
  onDelete(id: any) {
    this.confirmationService.confirm({
      header: 'Xoá khảo sát ?',
      message: 'Bạn có chắc chắn xoá ?',
      accept: () => {
        this.answerService
          .delete(id)
          .pipe(first())
          .subscribe({
            next: (res) => {
              //console.log(res);
              if (res !== null) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Thông báo',
                  detail: 'Đã xoá thành công !',
                });
                this.loadData();
              }
            },
            error: (err) => {
              if (err.error.StatusCode === 404) {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Thông báo',
                  detail: err.error.Message,
                });
              }
              else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Thông báo',
                  detail: `Đã có lỗi !`,
                });
              }
            },
          });
      },
    });
  }

}
