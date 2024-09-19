import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { UserLogin } from '@interfaces/user';
import { HttpErrorResponse } from '@angular/common/http';
import { UsersService } from '@services/users.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    ToastModule,
    MessagesModule,
  ],
  providers: [MessageService],
  templateUrl: './auth.component.html',
})
export default class AuthComponent {
  private usersService = inject(UsersService);
  private messageService = inject(MessageService);

  public email: string = '';
  public password: string = '';
  public showPassword: boolean = false;
  public remember: boolean = false;

  constructor(private route: Router) {
    this.email = localStorage.getItem('email') || '';
  }

  public authUser() {
    const authUser: UserLogin = {
      email: this.email,
      password: this.password,
    };

    this.usersService.authLogin(authUser, this.remember).subscribe(
      (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Error',
          detail: `¡Hola ${res.user.name}! Tu accesso fue exitoso`,
        });
        setTimeout(()=>{
          this.route.navigateByUrl('')
        }, 3000)
      },
      (error) => {
        if (error instanceof HttpErrorResponse && error.status === 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error de conexión',
            detail:
              'Hubo un problema de conexión. Por favor, revisa tu conexión a internet e intenta nuevamente. Sí el error persiste contacta a soporte',
            life: 5000,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        }
      }
    );
  }
}
