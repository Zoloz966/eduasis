import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { InputSwitchModule } from 'primeng/inputswitch';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { TeachersService } from '@services/teachers.service';
import { Gender, Teacher } from '@interfaces/teacher';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    InputNumberModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    InputTextareaModule,
    ToastModule,
    InputSwitchModule,
    CalendarModule,
  ],
  providers: [MessageService],
  templateUrl: './teacher.component.html',
})
export default class TeacherComponent implements OnInit {
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public teachersServices = inject(TeachersService);

  public teacher: Teacher = {
    id_teacher: 0,
    code_country: '+591',
    email: '',
    gender: Gender.Masculino,
    id: '',
    info: '',
    isEnabled: 1,
    name: '',
    lastname: '',
    phone: '',
    photo: '',
    token: '',
    birth_date: new Date(),
  };

  public inputsDirt = {
    name: false,
    lastname: false,
    id: false,
    role: false,
    phone: false,
    birth_date: false,
  };

  ngOnInit(): void {
    if (this.config.data) {
      this.teacher = {
        ...this.config.data.teacher,
        birth_date: (() => {
          let date = new Date(this.config.data.teacher.birth_date);
          date.setHours(date.getHours() + 4);
          return date;
        })(),
      };
    }
  }

  public async saveTeacher() {
    if (!(await this.passTeacherForm())) return;

    const newTeacher: Partial<Teacher> = {
      name: this.teacher.name,
      lastname: this.teacher.lastname,
      birth_date: this.teacher.birth_date,
      photo: this.teacher.photo,
      phone: this.teacher.phone.toString(),
      code_country: this.teacher.code_country,
      email: this.teacher.email,
      gender: this.teacher.gender,
      id: this.teacher.id,
      info: this.teacher.info,
    };

    if (this.teacher.id_teacher === 0) {
      this.teachersServices.postTeacher(newTeacher).subscribe((resTeacher) => {
        this.ref.close(resTeacher);
      });
    } else {
      this.teachersServices
        .updateTeacher(this.teacher.id_teacher, newTeacher)
        .subscribe((resTeacher) => {
          this.ref.close(resTeacher);
        });
    }
  }

  public passTeacherForm(): Promise<boolean> {
    let passForm = true;
    if (!this.teacher.name || this.teacher.name.length < 4) {
      this.inputsDirt.name = true;
      passForm = false;
    } else {
      this.inputsDirt.name = false;
    }
    if (!this.teacher.phone) {
      this.inputsDirt.phone = true;
      passForm = false;
    } else {
      this.inputsDirt.phone = false;
    }
    if (!this.teacher.birth_date) {
      this.inputsDirt.birth_date = true;
      passForm = false;
    } else {
      this.inputsDirt.birth_date = false;
    }


    if (!passForm) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error en el Formulario',
        detail: 'Porfavor complete los campos obligatorios',
      });
    }
    return Promise.resolve(passForm);
  }
}
