import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { TopbarComponent } from './topbar/topbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./survey/survey.module').then((m) => m.SurveyModule),
      },

      {
        path: 'category',
        loadChildren: () =>
          import('./category/category.module').then((m) => m.CategoryModule),
      },
      {
        path: 'survey',
        loadChildren: () =>
          import('./survey/survey.module').then((m) => m.SurveyModule),
      },
      {
        path: 'survey/:id/question',
        loadChildren: () =>
          import('./question/question.module').then((m) => m.QuestionModule),
      },
      {
        path: 'survey/:surveyId/question/:questionId/answer',
        loadChildren: () =>
          import('./answer/answer.module').then((m) => m.AnswerModule),
      }
    ],
  },
];
@NgModule({
  declarations: [
    MainComponent,
    TopbarComponent,
    SidebarComponent,
    FooterComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class MainModule { }
