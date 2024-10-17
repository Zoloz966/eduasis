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
import { StudentsService } from '@services/students.service';
import { Student } from '@interfaces/student';
import { Gender } from '@interfaces/teacher';
import { CoursesService } from '@services/courses.service';

@Component({
  selector: 'app-student',
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
  templateUrl: './student.component.html',
})
export default class StudentComponent implements OnInit {
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public studentsServices = inject(StudentsService);
  public coursesService = inject(CoursesService);

  public student: Student = {
    id_student: 0,
    code_country: '+591',
    email: '',
    gender: Gender.Masculino,
    id: '',
    info: '',
    isEnabled: 1,
    name: '',
    courseIdCourse: 1,
    lastname: '',
    tutor_phone: '',
    photo: '',
    token: '',
    birth_date: new Date(),
  };

  public inputsDirt = {
    name: false,
    lastname: false,
    id: false,
    course: false,
    phone: false,
    birth_date: false,
  };

  public courses = this.coursesService.courses;
  public loadginCourses = this.coursesService.loading;

  ngOnInit(): void {
    this.studentsServices.getAllStudents();
    this.coursesService.getAllCourses();
    if (this.config.data) {
      this.student = {
        ...this.config.data.student,
        birth_date: (() => {
          let date = new Date(this.config.data.student.birth_date);
          date.setHours(date.getHours() + 4);
          return date;
        })(),
      };
    }
  }

  public async saveStudent() {
    if (!(await this.passStudentForm())) return;

    const newStudent: Partial<Student> = {
      name: this.student.name,
      lastname: this.student.lastname,
      birth_date: this.student.birth_date,
      photo: this.student.photo,
      courseIdCourse: this.student.courseIdCourse,
      tutor_phone: this.student.tutor_phone.toString(),
      code_country: this.student.code_country,
      gender: this.student.gender,
      id: this.student.id,
      info: this.student.info,
    };

    if (this.student.id_student === 0) {
      this.studentsServices.postStudent(newStudent).subscribe((resStudent) => {
        this.ref.close(resStudent);
      });
    } else {
      this.studentsServices
        .updateStudent(this.student.id_student, newStudent)
        .subscribe((resStudent) => {
          this.ref.close(resStudent);
        });
    }
  }

  public passStudentForm(): Promise<boolean> {
    let passForm = true;
    if (!this.student.name || this.student.name.length < 4) {
      this.inputsDirt.name = true;
      passForm = false;
    } else {
      this.inputsDirt.name = false;
    }
    if (!this.student.tutor_phone) {
      this.inputsDirt.phone = true;
      passForm = false;
    } else {
      this.inputsDirt.phone = false;
    }
    if (!this.student.birth_date) {
      this.inputsDirt.birth_date = true;
      passForm = false;
    } else {
      this.inputsDirt.birth_date = false;
    }
    if (!this.student.course) {
      this.inputsDirt.course = true;
      passForm = false;
    } else {
      this.inputsDirt.course = false;
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
