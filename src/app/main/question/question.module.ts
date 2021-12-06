import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { QuestionComponent } from './question.component';

const routes: Routes = [
  {
    path: '',
    component: QuestionComponent,
  },
];

@NgModule({
  declarations: [
    QuestionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbAlertModule,
    NgxSpinnerModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService, FormBuilder]
})
export class QuestionModule { }
