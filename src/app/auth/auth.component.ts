import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { UserLogin } from '@interfaces/user';
import { HttpErrorResponse } from '@angular/common/http';
import { UsersService } from '@services/users.service';
import {
  SelectButtonChangeEvent,
  SelectButtonModule,
} from 'primeng/selectbutton';
import { StudentsService } from '@services/students.service';

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
    SelectButtonModule,
  ],
  providers: [MessageService],
  templateUrl: './auth.component.html',
})
export default class AuthComponent {
  private usersService = inject(UsersService);
  private studentsService = inject(StudentsService);
  private messageService = inject(MessageService);
  public route = inject(ActivatedRoute);

  public email: string = '';
  public password: string = '';
  public showPassword: boolean = false;
  public remember: boolean = false;

  public stateOptions: any[] = [
    { label: 'Estudiante', value: 'student' },
    { label: 'Maestro', value: 'teacher' },
    { label: 'Usuario', value: 'user' },
  ];

  public value: string = 'user';

  public tokenStudent: string | null =
    this.route.snapshot.paramMap.get('token');

  public loadingToken: boolean = false;

  constructor(private router: Router) {
    this.email = localStorage.getItem('email') || '';
    this.value = localStorage.getItem('typeUser') || '';

    if (this.tokenStudent) {
      this.loadingToken = true;
      this.studentsService.getOneStudentByToken(this.tokenStudent).subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Token autorizado',
            detail: `¡Hola estudiante ${res.user.name}! espera un momento porfavor`,
          });
          this.usersService.loginByToken(res);

          setTimeout(() => {
            this.router.navigateByUrl('edu/student-details/' + res.user.id_student!);
          }, 3000);
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        }
      );
    }
  }

  public handleLogin() {
    localStorage.setItem('typeUser', this.value);
    if (this.value === 'student') {
      this.authStudent();
      return;
    }
    if (this.value === 'teacher') {
      this.authTeacher();
      return;
    }
    if (this.value === 'user') {
      this.authUser();
      return;
    }
  }

  public authUser() {
    const authUser: UserLogin = {
      email: this.email,
      password: this.password,
    };

    this.usersService.authLoginUser(authUser, this.remember).subscribe(
      (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Usuario autorizado',
          detail: `¡Hola ${res.user.name}! Tu accesso fue exitoso`,
        });
        setTimeout(() => {
          this.router.navigateByUrl('');
        }, 3000);
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
  public authTeacher() {
    const authUser: UserLogin = {
      email: this.email,
      password: this.password,
    };

    this.usersService.authLoginTeacher(authUser, this.remember).subscribe(
      (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Usuario autorizado',
          detail: `¡Hola maestro ${res.user.name}! Tu accesso fue exitoso`,
        });
        setTimeout(() => {
          this.router.navigateByUrl('');
        }, 3000);
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

  public authStudent() {
    const authUser: UserLogin = {
      email: this.email,
      password: this.password,
    };

    this.usersService.authLoginStudent(authUser, this.remember).subscribe(
      (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Usuario autorizado',
          detail: `¡Hola estudiante: ${res.user.name}! Tu accesso fue exitoso`,
        });
        setTimeout(() => {
          this.router.navigateByUrl('');
        }, 3000);
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
