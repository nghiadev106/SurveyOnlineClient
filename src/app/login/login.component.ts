import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authen.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService, FormBuilder],
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private messageService: MessageService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.authenticationService.logout();
    this.formLogin = this.fb.group({
      username: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }
  onLogin() {
    var userLogin = {
      username: this.formLogin.get('username').value,
      password: this.formLogin.get('password').value,
    };
    this.spinner.show();
    this.authenticationService
      .login(userLogin)
      .pipe(first())
      .subscribe(
        (user) => {
          if (user !== null) {
            //this.spinner.hide();
            this.router.navigateByUrl('/admin');
          } else {

          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Thông báo',
            detail: `Đã có lỗi !`,
          });
          this.spinner.hide();
        }
      );
  }
  clearFormLogin() {
    this.formLogin.reset();
  }

}
